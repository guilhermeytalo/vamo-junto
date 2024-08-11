interface Race {
    id?: string
    userId?: string | null
    createdAt?: string
    updatedAt?: string
    seats?: number
    carId?: string
    timeStart?: Date
    passengerProfile?: boolean
    acceptPoint?: boolean
    driver?: Driver
}

interface Driver {
    id: string
    name: string
    email: string
    password: string
    createdAt?: string
    updatedAt?: string
  }

interface Car {
  id?: string;
  plate: string;
  brand: string;
  model: string;
  type: string;
  color: string;
  year: string;
  document?: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
}

interface DropdownItem {
  label: string;
  value: string;
}