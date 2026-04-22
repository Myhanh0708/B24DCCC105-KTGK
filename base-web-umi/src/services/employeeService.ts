import { Employee } from '../models/employee';

const STORAGE_KEY = 'QLNV_DATA';

export const EmployeeService = {
  getAll: (): Employee[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  save: (employee: Employee) => {
    const list = EmployeeService.getAll();
    const index = list.findIndex(item => item.id === employee.id);
    if (index > -1) {
      list[index] = employee;
    } else {
      list.push(employee);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  },

  delete: (id: string) => {
    const list = EmployeeService.getAll().filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
};