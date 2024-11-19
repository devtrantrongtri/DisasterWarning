export type Disaster = {
    disasterId: number;
    disasterName: string;
    imageUrl: string;
    imageFile?: File;
    description: string;
    disasterInfos: DisasterInfo[];
    disasterWarnings: DisasterWarning[];
};

export type DisasterInfo = {
    disasterInfoId: number;
    typeInfo: string;
    information: string;
    disaster: Disaster;
    images: DisasterImage[];
};

export interface CreateDisasterRequest {
    disaster: {
        disasterName: string;
        description: string;
    };
    images?: File;
}

export interface CreateDisasterResponse {
    message: string;
    data: Disaster;
}

export interface GetDisasterByIdResponse {
    message: string;
    data: Disaster;
}

export interface CreateDisasterInfoRequest {
    disasterInfo: {
        typeInfo: string;
        information: string;
        disaster: Disaster;
    };
    images?: DisasterImage[];
}

export interface CreateDisasterInfoResponse {
    message: string;
    data: DisasterInfo;
}

export interface DisasterWarning {
    disasterWarningId: number;
    description: string;
    startDate: Date;
}

export type DisasterImage = {
    imageUrl?: string;
    imageFile?: File;
    imagePublicId?: string | null;
};

export type Pageable = {
    pageNumber: number;
    pageSize: number;
    sort: Sort;
    offset: number;
    paged: boolean;
    unpaged: boolean;
    totalElements?: number;
    totalPages?: number;
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
