import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { AdminService } from '../modules/admin/admin.service';

const adminService = new AdminService();

passport.use(
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
    try {
      const admin = await adminService.getAdminByEmailWithPassword(email);
      if (!admin) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      return done(null, admin);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((admin: any, done: any) => {
  done(null, admin.id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const admin = await adminService.getAdminById(id);
    done(null, admin);
  } catch (error) {
    done(error);
  }
});

export default passport;
