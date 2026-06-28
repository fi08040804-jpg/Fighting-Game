const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// 🔥 IMPORTANT: CORS fix (online ke liye zaroori)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.static('public'));

let rooms = {};

io.on('connection', (socket) => {
    console.log("🟢 Player connected:", socket.id);

    socket.on('joinRoom', (room) => {
        socket.join(room);

        if (!rooms[room]) rooms[room] = [];
        rooms[room].push(socket.id);

        socket.room = room;

        console.log(`Player ${socket.id} joined room: ${room}`);

        io.to(room).emit('players', rooms[room]);
    });

    socket.on('move', (data) => {
        if (socket.room) {
            socket.to(socket.room).emit('move', data);
        }
    });

    socket.on('attack', (data) => {
        if (socket.room) {
            socket.to(socket.room).emit('attack', data);
        }
    });

    socket.on('disconnect', () => {
        console.log("🔴 Player disconnected:", socket.id);

        if (socket.room && rooms[socket.room]) {
            rooms[socket.room] = rooms[socket.room].filter(id => id !== socket.id);

            io.to(socket.room).emit('players', rooms[socket.room]);

            // 🧹 Empty room delete
            if (rooms[socket.room].length === 0) {
                delete rooms[socket.room];
            }
        }
    });
});

// 🔥 VERY IMPORTANT (online hosting ke liye)
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});