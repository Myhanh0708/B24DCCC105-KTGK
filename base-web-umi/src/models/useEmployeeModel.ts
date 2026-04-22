import { useState, useCallback } from 'react';
import { Employee } from './employee';
import { EmployeeService } from '@/services/employeeService';

export default function useEmployeeModel() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Hàm fetch dữ liệu từ service (localStorage)
  const fetchEmployees = useCallback(() => {
    const data = EmployeeService.getAll();
    setEmployees(data);
  }, []);

  // Hàm thêm/sửa
  const saveEmployee = useCallback((emp: Employee) => {
    EmployeeService.save(emp);
    fetchEmployees(); // Cập nhật lại state sau khi lưu
  }, [fetchEmployees]);

  // Hàm xóa
  const deleteEmployee = useCallback((id: string) => {
    EmployeeService.delete(id);
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    fetchEmployees,
    saveEmployee,
    deleteEmployee,
  };
}