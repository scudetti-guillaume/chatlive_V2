declare module 'socketio-file-upload' {
    import { Socket } from 'socket.io';

    export interface FileLikeObject {
        file: File;
        lastModified: number;
        size: number;
        type: string;
    }

    export interface UploadEvent {
        type: string;
        file: FileLikeObject;
        xhr: XMLHttpRequest;
        form: FormData;
        files: FileLikeObject[];
    }

    export class SocketIOFileUpload {
        constructor(socket: Socket);
        listen(socket: Socket): void;
        on(event: string, callback: (event: UploadEvent) => void): void;
        upload(socket: Socket, form: FormData, callback: (status: string) => void): void;
    }

    const siofu: SocketIOFileUpload;
    export default siofu;
}
