import {Server, Profile,Member} from "@prisma/client"
import {Server as NetServer,Socket} from "net";
import { NextApiResponse } from "next";
import {Server as SocketIOserver} from "socket.io";
export type ServerWithMemberswithProfiles=Server&{
    members:(Member&{profile:Profile})[];
}

export type NextApiResponseServerIO=NextApiResponse&{
    socket:Socket &{
        server:NetServer &{
            io?:SocketIOserver;
        };
    };
}