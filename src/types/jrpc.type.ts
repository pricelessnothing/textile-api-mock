export type JrpcRequestDto = {
  method: string;
  params: any;
};

export type JrpcResponseDto<T = any> = {
  result?: T;
  error?: any;
  status: number;
};
