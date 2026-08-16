import { adminAuth } from '@/lib/firebaseAdmin';

const SUPER_ADMIN_EMAILS = ['mm5329844@gmail.com'];

export async function POST(req) {
  try {
    const { idToken, targetUid, newPassword } = await req.json();

    if (!idToken || !targetUid || !newPassword) {
      return Response.json({ success: false, error: 'بيانات ناقصة.' }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return Response.json({ success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.' }, { status: 400 });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    if (!SUPER_ADMIN_EMAILS.includes(decoded.email)) {
      return Response.json({ success: false, error: 'غير مصرح لك بتنفيذ هذا الإجراء.' }, { status: 403 });
    }

    await adminAuth.updateUser(targetUid, { password: newPassword });

    return Response.json({ success: true });
  } catch (e) {
    console.error('change-password error:', e);
    return Response.json({ success: false, error: e.message || 'حدث خطأ أثناء تغيير كلمة المرور.' }, { status: 500 });
  }
}
