export interface AdminInfo {
  username: string;
  role: string;
  displayName: string;
}

export interface SuperAdminAccount extends AdminInfo {
  passwordHash: string;
}

export async function hashPassword(str: string): Promise<string> {
  const enc = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc.encode(str));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const SUPER_ADMIN_ACCOUNTS: SuperAdminAccount[] = [
  {
    username: 'azada122321',
    passwordHash: '3aaf3b3a63882adb55e66e28b439526ab114acd84aa6cbe1047d2a7ddd00ce55',
    role: 'Super Admin',
    displayName: 'Azada',
  },
  {
    username: 'damir122321',
    passwordHash: 'f5bc743f53ff021d049a940733f4998f44589b8e24b6113cb5fba08641afc171',
    role: 'Super Admin',
    displayName: 'Damir',
  },
];
