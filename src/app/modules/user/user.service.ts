import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

const createStudentInToDB = async (password: string, payload: TStudent) => {
  const userData: Partial<TUser> = {};

  userData.password = password || (config.default_pass as string);
  userData.role = 'student'; // student role

  // get semester by _id
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );
// call generateId create function
  userData.id = await generateStudentId((admissionSemester as TAcademicSemester));

  const newUser = await User.create(userData);

  if (Object.values(newUser).length) {
    payload.id = newUser.id; // embedding id
    payload.user = newUser._id; // reference id
  }
  const newStudent = await Student.create(payload);
  return newStudent;
};

export const UsersServices = {
  createStudentInToDB,
};