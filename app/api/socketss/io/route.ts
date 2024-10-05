import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import { NextApiResponseServerIO } from "@/types";

// Ensure the NextApiResponseServerIO extends NextApiResponse and includes socket and io properties
export const config = {
    api: {
        bodyParser: false,
    },
};

export async function GET(req: NextApiRequest, res: NextApiResponseServerIO) {
    // Ensure that res.socket.server is defined and is of the type NetServer
    if (res.socket.server && res.socket.server instanceof NetServer) {
        if (!res.socket.server.io) {
            const path = "/api/socket/io";
            const httpServer: NetServer = res.socket.server;
            const io = new ServerIO(httpServer, {
                path: path,
                addTrailingSlash: false,
            });
            res.socket.server.io = io;
        }
    } else {
        console.error('Server or socket is not defined or is not an instance of NetServer');
    }
    return res.status(200).json({ success: true });
}
