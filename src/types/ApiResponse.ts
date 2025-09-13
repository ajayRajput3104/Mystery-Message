import { Message } from "@/models/User";

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface AcceptMessagesResponse extends ApiResponse {
  isAcceptingMessages: boolean;
}
export interface GetMessagesResponse extends ApiResponse {
  messages: Array<Message>;
}
export interface SuggestMessagesResponse extends ApiResponse {
  result: string;
}
export interface GetUsersResponse extends ApiResponse {
  users: [];
}
