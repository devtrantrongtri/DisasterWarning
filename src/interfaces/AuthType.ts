export type UserResponse = {
    message: string;
    data: {
      content: User[];
      pageable: Pageable;
      totalElements: number;
      totalPages: number;
      last: boolean;
      size: number;
      number: number;
      sort: Sort;
      first: boolean;
      numberOfElements: number;
      empty: boolean;
    };
  };
  
  export type User = {
    userId: number;
    userName: string;
    email: string;
    password?: string;
    role: string;
    status: string;
    location: Location;
  };
  
  
  export type GetUserByIdResponse = {
    message: string;
    data: User
  };

  
  export type Location = {
    locationId: number;
    status?: string;
    disasterWarnings?: string[];
    locationName?: string;
    latitude?: number;
    longitude?: number;
  };
  

  export type UserUpdate = {
    userId: number;
    userName?: string;
    email?: string;
    password?: string;
    role?: string;
    status?: string;
    location?: { locationId: number };
  };
    
  
  export type Pageable = {
    pageNumber: number;
    pageSize: number;
    sort: Sort;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  
  export type PageReq = {
    page: number;
    size: number;
  };
  export type Sort = {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  
// auth
  export interface LoginRequest {
    email: string;
    password: string;
    role: string;
  }
  
  export interface LoginResponse {
    message: string;
    data: {
      token: string;
      expirationDate: string;
      refreshToken: string;
      tokenType: string;
      userId: Number;
      userName: string;
      email: string;
      role: string;
    };
  }

  export interface CountTokenRequest {
    message: string;
    data: number;
  }

  export interface RegisterRequest {
    userName: string;
    email: string;
    password: string;
    role: string;
    location: {
      locationId: number ;
    } | undefined;
  }
  
  export interface RegisterResponse {
    message: string;
    data: {
      userId: number;
      userName: string;
      email: string;
      password: string;
      role: string;
      status: string;
      location: Location
    };
  }

  export interface CreateLocationRequest {
    locationName: string;
    latitude: number;
    longitude: number;
  }

  export interface CreateLocationResponse {
    message: string;
    data: Location;
  }