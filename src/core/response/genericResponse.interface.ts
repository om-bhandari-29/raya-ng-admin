export interface IGenericResponse<DType> {
    status: boolean;
    message: string;
    statusCode: number;
    data: DType;
}