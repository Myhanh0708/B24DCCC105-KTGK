// 1. Định nghĩa Enum cho các giá trị cố định (đúng yêu cầu đề bài)
export enum EmployeeStatus {
  PROBATION = 'Thử việc',
  CONTRACTED = 'Đã ký hợp đồng',
  ON_LEAVE = 'Nghỉ phép',
  RESIGNED = 'Đã thôi việc',
}

// 2. Định nghĩa Interface cho đối tượng Nhân viên
export interface Employee {
  id: string;          // Mã nhân viên
  fullName: string;    // Họ tên
  position: string;    // Chức vụ
  department: string;  // Phòng ban
  salary: number;      // Lương
  status: EmployeeStatus; // Trạng thái (dùng Enum trên)
}

// 3. Định nghĩa Initial State (Dữ liệu khởi tạo nếu cần)
export const initialEmployee: Partial<Employee> = {
  status: EmployeeStatus.PROBATION,
  salary: 0,
};