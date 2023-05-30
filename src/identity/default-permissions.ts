export const defaultPermissions: Record<string, Record<string, string[]>[]> = {
  admin: [{ '/*': ['*'] }],
  systemManager: [
    { '/admin/*': ['*'] },
    { '/admin/auth/reset-password': ['*'] },
    { '/chats/hide': ['PUT'] },
    { '/chats/freeze': ['PUT'] },
    { '/chats/leave': ['PUT'] },
  ],
  normal: [
    { '/user': ['POST'] },
    { '/auth/*': ['*'] },
    { '/products': ['*'] },
    { '/products/*': ['*'] },
  ],
};
