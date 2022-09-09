export const END_POINT_DATABASE = {
  ROOT: 'block_sign',
  ORIGINAL: 'block_sign/original',
  ORIGINAL_FILE: 'block_sign/original/{{sha256}}',
  SIGN_FILE: 'block_sign/sign/{{sha256_original}}/{{sha256_file}}',
};
export const END_POINT_STORE = {
  ROOT: 'block_sign',
  ORIGINAL_FILE: 'block_sign/{{sha256}}/{{fileName}}',
  SIGN_FOLDER: 'block_sign/{{sha256}}/sign',
  SIGN_FILE: 'block_sign/{{sha256}}/sign/{{fileName}}',
};
