export function isAdmin(email: string) {
    const adminList = process.env.ADMIN_EMAILS?.split(",") || [];
    return adminList.includes(email);
  }
  