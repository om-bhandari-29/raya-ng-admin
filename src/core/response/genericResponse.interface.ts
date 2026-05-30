export interface IResponseMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IGenericResponse<DType> {
  status: boolean;
  message: string;
  statusCode: number;
  data: DType;
  meta?: IResponseMeta;
}
export interface IGenericListResponse<DType> {
  status: boolean;
  message: string;
  statusCode: number;
  data: {
    items: DType[];
  };
  meta?: IResponseMeta;
}
