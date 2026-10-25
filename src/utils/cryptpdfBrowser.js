// src/encrypt.ts
import { PDFDocument, PDFName, PDFHexString, PDFString, PDFDict, PDFArray, PDFRawStream, PDFNumber, PDFBool } from "pdf-lib";

// src/crypto.ts
var AES_BLOCK_SIZE = 16;
var KEY_LENGTH = 32;

function getRandomBytes(length) {
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.getRandomValues) {
    const out = new Uint8Array(length);
    globalThis.crypto.getRandomValues(out);
    return out;
  }
  throw new Error("cryptpdf: WebCrypto getRandomValues not available.");
}

async function sha256(data) {
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.subtle) {
    const buf = await globalThis.crypto.subtle.digest("SHA-256", data);
    return new Uint8Array(buf);
  }
  throw new Error("cryptpdf: WebCrypto subtle.digest not available.");
}
function xor16(a, b) {
  const out = new Uint8Array(16);
  for (let i = 0; i < 16; i++) out[i] = a[i] ^ b[i];
  return out;
}
async function aes256CbcEncryptNoPadding(key, iv, plaintext) {
  if (plaintext.length % AES_BLOCK_SIZE !== 0 || iv.length !== AES_BLOCK_SIZE) {
    throw new Error("Plaintext length must be multiple of 16; IV must be 16 bytes");
  }
  const out = new Uint8Array(plaintext.length);
  let prev = iv;
  for (let i = 0; i < plaintext.length; i += AES_BLOCK_SIZE) {
    const block = xor16(prev, plaintext.subarray(i, i + AES_BLOCK_SIZE));
    const enc = await aes256EcbEncrypt(key, block);
    out.set(enc, i);
    prev = enc;
  }
  return out;
}
async function aes256CbcDecryptNoPadding(key, iv, ciphertext) {
  if (ciphertext.length % AES_BLOCK_SIZE !== 0 || iv.length !== AES_BLOCK_SIZE) {
    throw new Error("Ciphertext length must be multiple of 16; IV must be 16 bytes");
  }
  const out = new Uint8Array(ciphertext.length);
  let prev = new Uint8Array(iv);
  for (let i = 0; i < ciphertext.length; i += AES_BLOCK_SIZE) {
    const enc = new Uint8Array(ciphertext.subarray(i, i + AES_BLOCK_SIZE));
    const dec = await aes256EcbDecrypt(key, enc);
    for (let j = 0; j < 16; j++) out[i + j] = prev[j] ^ dec[j];
    prev = enc;
  }
  return out;
}
async function aes256CbcEncrypt(key, iv, plaintext) {
  if (key.length !== KEY_LENGTH || iv.length !== AES_BLOCK_SIZE) {
    throw new Error("AES-256-CBC: key must be 32 bytes, IV 16 bytes");
  }
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.subtle) {
    const cryptoKey = await globalThis.crypto.subtle.importKey(
      "raw",
      key,
      { name: "AES-CBC", length: 256 },
      false,
      ["encrypt"]
    );
    const buf = await globalThis.crypto.subtle.encrypt(
      { name: "AES-CBC", iv },
      cryptoKey,
      plaintext
    );
    return new Uint8Array(buf);
  }
  throw new Error("WebCrypto AES-CBC encrypt not available");
}
async function aes256CbcDecrypt(key, iv, ciphertext) {
  if (key.length !== KEY_LENGTH || iv.length !== AES_BLOCK_SIZE) {
    throw new Error("AES-256-CBC: key must be 32 bytes, IV 16 bytes");
  }
  if (ciphertext.length % AES_BLOCK_SIZE !== 0) {
    throw new Error("AES-256-CBC: ciphertext length must be multiple of 16");
  }
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.subtle) {
    const cryptoKey = await globalThis.crypto.subtle.importKey(
      "raw",
      key,
      { name: "AES-CBC", length: 256 },
      false,
      ["decrypt"]
    );
    const buf = await globalThis.crypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      cryptoKey,
      ciphertext
    );
    return new Uint8Array(buf);
  }
  throw new Error("WebCrypto AES-CBC decrypt not available");
}
async function aes256EcbEncrypt(key, block) {
  if (block.length !== AES_BLOCK_SIZE || key.length !== KEY_LENGTH) {
    throw new Error("AES-256-ECB: 16-byte block, 32-byte key");
  }
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.subtle) {
    const cryptoKey = await globalThis.crypto.subtle.importKey(
      "raw",
      key,
      { name: "AES-CBC", length: 256 },
      false,
      ["encrypt"]
    );
    const buf = await globalThis.crypto.subtle.encrypt(
      { name: "AES-CBC", iv: new Uint8Array(16) },
      cryptoKey,
      block
    );
    return new Uint8Array(buf).slice(0, AES_BLOCK_SIZE);
  }
  throw new Error("WebCrypto AES-ECB encrypt not available");
}
async function aes256EcbDecrypt(key, block) {
  if (block.length !== AES_BLOCK_SIZE || key.length !== KEY_LENGTH) {
    throw new Error("AES-256-ECB: 16-byte block, 32-byte key");
  }
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.subtle) {
    const FULL_PAD = new Uint8Array(16).fill(16);
    const c2Input = xor16(FULL_PAD, block);
    const c2 = await aes256EcbEncrypt(key, c2Input);
    const twoBlocks = new Uint8Array(32);
    twoBlocks.set(block, 0);
    twoBlocks.set(c2, 16);
    const cryptoKey = await globalThis.crypto.subtle.importKey(
      "raw",
      key,
      { name: "AES-CBC", length: 256 },
      false,
      ["decrypt"]
    );
    const buf = await globalThis.crypto.subtle.decrypt(
      { name: "AES-CBC", iv: new Uint8Array(16) },
      cryptoKey,
      twoBlocks
    );
    return new Uint8Array(buf);
  }
  throw new Error("WebCrypto AES-ECB decrypt not available");
}

// src/saslprep.ts
var MAX_PASSWORD_UTF8_BYTES = 127;
function preparePassword(password) {
  const encoded = new TextEncoder().encode(password);
  if (encoded.length > MAX_PASSWORD_UTF8_BYTES) {
    return encoded.slice(0, MAX_PASSWORD_UTF8_BYTES);
  }
  return encoded;
}

// src/kdf.ts
var ZERO_IV = new Uint8Array(16);
function concat(...arr) {
  const total = arr.reduce((s, a) => s + a.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const a of arr) {
    out.set(a, off);
    off += a.length;
  }
  return out;
}
async function computeRev5Keys(params) {
  const userPwd = preparePassword(params.userPassword);
  const ownerPwd = preparePassword(params.ownerPassword || params.userPassword);
  const fileEncryptionKey = getRandomBytes(32);
  const userValSalt = getRandomBytes(8);
  const userKeySalt = getRandomBytes(8);
  const uHash = await sha256(concat(userPwd, userValSalt));
  const U = concat(uHash, userValSalt, userKeySalt);
  const ueKey = await sha256(concat(userPwd, userKeySalt));
  const UE = await aes256CbcEncryptNoPadding(ueKey, ZERO_IV, fileEncryptionKey);
  const ownerValSalt = getRandomBytes(8);
  const ownerKeySalt = getRandomBytes(8);
  const oHash = await sha256(concat(ownerPwd, ownerValSalt, U));
  const O = concat(oHash, ownerValSalt, ownerKeySalt);
  const oeKey = await sha256(concat(ownerPwd, ownerKeySalt, U));
  const OE = await aes256CbcEncryptNoPadding(oeKey, ZERO_IV, fileEncryptionKey);
  const permsBlock = new Uint8Array(16);
  const p = params.permissions >>> 0 & 4294967295;
  permsBlock[0] = p & 255;
  permsBlock[1] = p >> 8 & 255;
  permsBlock[2] = p >> 16 & 255;
  permsBlock[3] = p >> 24 & 255;
  permsBlock[4] = 255;
  permsBlock[5] = 255;
  permsBlock[6] = 255;
  permsBlock[7] = 255;
  permsBlock[8] = params.encryptMetadata ? 84 : 70;
  permsBlock[9] = 97;
  permsBlock[10] = 100;
  permsBlock[11] = 98;
  const rnd = getRandomBytes(4);
  permsBlock.set(rnd, 12);
  const Perms = await aes256EcbEncrypt(fileEncryptionKey, permsBlock);
  return { fileEncryptionKey, O, U, OE, UE, Perms };
}
async function deriveFileKeyFromPassword(password, U, O, OE, UE) {
  const pwd = preparePassword(password);
  const userValSalt = U.subarray(32, 40);
  const userKeySalt = U.subarray(40, 48);
  const uCheck = await sha256(concat(pwd, userValSalt));
  if (compareBytes(uCheck, U.subarray(0, 32)) === 0) {
    try {
      const ueKey = await sha256(concat(pwd, userKeySalt));
      const key = await aes256CbcDecryptNoPadding(ueKey, ZERO_IV, UE);
      if (key.length === 32) return key;
    } catch {
    }
  }
  const ownerValSalt = O.subarray(32, 40);
  const ownerKeySalt = O.subarray(40, 48);
  const oCheck = await sha256(concat(pwd, ownerValSalt, U));
  if (compareBytes(oCheck, O.subarray(0, 32)) === 0) {
    try {
      const oeKey = await sha256(concat(pwd, ownerKeySalt, U));
      const key = await aes256CbcDecryptNoPadding(oeKey, ZERO_IV, OE);
      if (key.length === 32) return key;
    } catch {
    }
  }
  return null;
}
function compareBytes(a, b) {
  if (a.length !== b.length) return 1;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return 1;
  return 0;
}

// src/encrypt.ts
var IV_LEN = 16;
function bytesToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function encryptObject(data, fileKey) {
  const iv = getRandomBytes(IV_LEN);
  const ciphertext = await aes256CbcEncrypt(fileKey, iv, data);
  const out = new Uint8Array(iv.length + ciphertext.length);
  out.set(iv);
  out.set(ciphertext, iv.length);
  return out;
}
var PDFHexStringOf = PDFHexString.of;
async function encryptStringsInDict(dict, enc) {
  for (const [key, value] of dict.entries()) {
    const n = key.asString();
    if (n === "/Length" || n === "/Filter" || n === "/DecodeParms") continue;
    if (value instanceof PDFString) {
      const encrypted = await enc(value.asBytes());
      dict.set(key, PDFHexStringOf(bytesToHex(encrypted)));
    } else if (value instanceof PDFHexString) {
      const encrypted = await enc(value.asBytes());
      dict.set(key, PDFHexStringOf(bytesToHex(encrypted)));
    } else if (value instanceof PDFDict) {
      await encryptStringsInDict(value, enc);
    } else if (value instanceof PDFArray) {
      await encryptStringsInArray(value, enc);
    }
  }
}
async function encryptStringsInArray(arr, enc) {
  for (const el of arr.asArray()) {
    if (el instanceof PDFDict) {
      await encryptStringsInDict(el, enc);
    } else if (el instanceof PDFArray) {
      await encryptStringsInArray(el, enc);
    }
  }
}
async function encryptPDF(pdfBytes, userPassword, ownerPassword, options = {}) {
  const permissions = options.permissions ?? -4;
  const encryptMetadata = options.encryptMetadata !== false;
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true, updateMetadata: false });
  const context = pdfDoc.context;
  const trailer = context.trailerInfo;
  if (!trailer.ID) {
    const fileId = getRandomBytes(16);
    trailer.ID = [
      PDFHexStringOf(bytesToHex(fileId)),
      PDFHexStringOf(bytesToHex(fileId))
    ];
  }
  const keys = await computeRev5Keys({
    userPassword,
    ownerPassword: ownerPassword ?? userPassword,
    permissions,
    encryptMetadata
  });
  const enc = (data) => encryptObject(data, keys.fileEncryptionKey);
  const indirectObjects = context.enumerateIndirectObjects();
  for (const [, obj] of indirectObjects) {
    if (obj instanceof PDFDict) {
      const filter = obj.get(PDFName.of("Filter"));
      if (filter && filter.asString() === "/Standard") continue;
    }
    if (obj instanceof PDFRawStream) {
      const streamData = obj.contents;
      const encrypted = await enc(streamData);
      obj.contents = encrypted;
    }
    if (obj instanceof PDFDict) {
      await encryptStringsInDict(obj, enc);
    } else if (obj instanceof PDFArray) {
      await encryptStringsInArray(obj, enc);
    }
  }
  const PDFNumberOf = PDFNumber.of;
  const stdCFDict = PDFDict.withContext(context);
  stdCFDict.set(PDFName.of("Type"), PDFName.of("CryptFilter"));
  stdCFDict.set(PDFName.of("CFM"), PDFName.of("AESV3"));
  stdCFDict.set(PDFName.of("Length"), PDFNumberOf(32));
  const cfDict = PDFDict.withContext(context);
  cfDict.set(PDFName.of("StdCF"), stdCFDict);
  const encryptDict = PDFDict.withContext(context);
  encryptDict.set(PDFName.of("Filter"), PDFName.of("Standard"));
  encryptDict.set(PDFName.of("V"), PDFNumberOf(5));
  encryptDict.set(PDFName.of("R"), PDFNumberOf(5));
  encryptDict.set(PDFName.of("Length"), PDFNumberOf(256));
  encryptDict.set(PDFName.of("P"), PDFNumberOf(permissions));
  encryptDict.set(PDFName.of("O"), PDFHexStringOf(bytesToHex(keys.O)));
  encryptDict.set(PDFName.of("U"), PDFHexStringOf(bytesToHex(keys.U)));
  encryptDict.set(PDFName.of("OE"), PDFHexStringOf(bytesToHex(keys.OE)));
  encryptDict.set(PDFName.of("UE"), PDFHexStringOf(bytesToHex(keys.UE)));
  encryptDict.set(PDFName.of("Perms"), PDFHexStringOf(bytesToHex(keys.Perms)));
  encryptDict.set(PDFName.of("EncryptMetadata"), encryptMetadata ? PDFBool.True : PDFBool.False);
  encryptDict.set(PDFName.of("CF"), cfDict);
  encryptDict.set(PDFName.of("StmF"), PDFName.of("StdCF"));
  encryptDict.set(PDFName.of("StrF"), PDFName.of("StdCF"));
  const encryptRef = context.register(encryptDict);
  trailer.Encrypt = encryptRef;
  return pdfDoc.save({ useObjectStreams: false });
}

// src/decrypt.ts
import { PDFDocument as PDFDocument2, PDFName as PDFName2, PDFHexString as PDFHexString2, PDFString as PDFString2, PDFDict as PDFDict2, PDFArray as PDFArray2, PDFRawStream as PDFRawStream2 } from "pdf-lib";
var IV_LEN2 = 16;
function getEncryptBytes(dict, key) {
  const v = dict.get(PDFName2.of(key));
  if (!v) return null;
  if (v instanceof PDFHexString2) return v.asBytes();
  if (v instanceof PDFString2) return v.asBytes();
  return null;
}
async function decryptObject(data, fileKey) {
  if (data.length < IV_LEN2 + 16) throw new Error("Encrypted object too short");
  const iv = data.slice(0, IV_LEN2);
  const ciphertext = data.slice(IV_LEN2);
  return aes256CbcDecrypt(fileKey, iv, ciphertext);
}
function bytesToHex2(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
var PDFHexStringOf2 = PDFHexString2.of;
async function decryptStringsInDict(dict, dec) {
  for (const [key, value] of dict.entries()) {
    const n = key.asString();
    if (n === "/Length" || n === "/Filter" || n === "/DecodeParms") continue;
    if (value instanceof PDFHexString2 || value instanceof PDFString2) {
      const bytes = value.asBytes();
      if (bytes.length < IV_LEN2 + 16) continue;
      try {
        const decrypted = await dec(bytes);
        dict.set(key, PDFHexStringOf2(bytesToHex2(decrypted)));
      } catch {
      }
    } else if (value instanceof PDFDict2) {
      await decryptStringsInDict(value, dec);
    } else if (value instanceof PDFArray2) {
      await decryptStringsInArray(value, dec);
    }
  }
}
async function decryptStringsInArray(arr, dec) {
  for (const el of arr.asArray()) {
    if (el instanceof PDFDict2) {
      await decryptStringsInDict(el, dec);
    } else if (el instanceof PDFArray2) {
      await decryptStringsInArray(el, dec);
    }
  }
}
async function decryptPDF(pdfBytes, password) {
  const pdfDoc = await PDFDocument2.load(pdfBytes, { ignoreEncryption: true, updateMetadata: false });
  const context = pdfDoc.context;
  const trailer = context.trailerInfo;
  const encryptRef = trailer.Encrypt;
  if (!encryptRef) throw new Error("PDF is not encrypted");
  const encryptObj = context.lookup(encryptRef);
  if (!(encryptObj instanceof PDFDict2)) throw new Error("Invalid Encrypt dictionary");
  const R = encryptObj.lookup(PDFName2.of("R"));
  const V = encryptObj.lookup(PDFName2.of("V"));
  const r = R && "asNumber" in R ? R.asNumber() : 0;
  const v = V && "asNumber" in V ? V.asNumber() : 0;
  if (r !== 5 || v !== 5) {
    throw new Error(`Unsupported encryption: R=${r}, V=${v}. Only AES-256 (R=5, V=5) is supported.`);
  }
  const O = getEncryptBytes(encryptObj, "O");
  const U = getEncryptBytes(encryptObj, "U");
  const OE = getEncryptBytes(encryptObj, "OE");
  const UE = getEncryptBytes(encryptObj, "UE");
  if (!O || !U || !OE || !UE || O.length !== 48 || U.length !== 48 || OE.length !== 32 || UE.length !== 32) {
    throw new Error(
      `Invalid Encrypt dictionary: O=${O?.length}, U=${U?.length}, OE=${OE?.length}, UE=${UE?.length}`
    );
  }
  const fileKey = await deriveFileKeyFromPassword(password, U, O, OE, UE);
  if (!fileKey) throw new Error("Wrong password");
  const dec = (data) => decryptObject(data, fileKey);
  const indirectObjects = context.enumerateIndirectObjects();
  for (const [, obj] of indirectObjects) {
    if (obj instanceof PDFDict2) {
      const filter = obj.get(PDFName2.of("Filter"));
      if (filter && filter.asString() === "/Standard") continue;
    }
    if (obj instanceof PDFRawStream2) {
      const streamData = obj.contents;
      const decrypted = await dec(streamData);
      obj.contents = decrypted;
    }
    if (obj instanceof PDFDict2) {
      await decryptStringsInDict(obj, dec);
    } else if (obj instanceof PDFArray2) {
      await decryptStringsInArray(obj, dec);
    }
  }
  delete trailer.Encrypt;
  return pdfDoc.save({ useObjectStreams: false });
}
export {
  decryptPDF,
  encryptPDF
};