export const END_POINT_DATABASE = {
  ROOT: 'block_sign',
  ORIGINAL: 'block_sign/original_document',
  ORIGINAL_FILE: 'block_sign/original_document/{{sha256}}',
  SIGN_FILE: 'block_sign/sign/{{sha256_original}}/{{sha256_file}}',
  SIGNED_FILE: 'block_sign/signed_document/{{sha256}}',
  SIGNATURE: 'signature/{{sha256}}',
};
export const END_POINT_STORE = {
  ROOT: 'block_sign',
  ORIGINAL_FILE: 'block_sign/{{sha256}}/{{fileName}}',
  SIGN_FOLDER: 'block_sign/{{sha256}}/sign',
  SIGN_FILE: 'block_sign/{{sha256}}/sign/{{fileName}}',
  SIGN_DOCUMENT: 'block_sign/{{sha256}}/response/{{fileName}}',
  SIGNATURE: 'signature/{{sha256}}/{{fileName}}',
};
