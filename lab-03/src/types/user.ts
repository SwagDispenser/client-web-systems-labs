export type UserGender = 'male' | 'female'

export interface UserName {
  title: string
  first: string
  last: string
}

export interface UserLocation {
  street: {
    number: number
    name: string
  }
  city: string
  state: string
  country: string
  postcode: string
}

export interface UserDateOfBirth {
  date: string
  age: number
}

export interface User {
  id: number
  gender: UserGender
  name: UserName
  location: UserLocation
  email: string
  phone: string
  picture: string
  dob: UserDateOfBirth
  hobbies: string[]
  details: string
}
