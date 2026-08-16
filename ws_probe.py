import asyncio, json, sys
import websockets

async def main():
    async with websockets.connect("ws://127.0.0.1:8080/ws/alerts") as ws:
        print("CONNECTED", flush=True)
        try:
            while True:
                msg = await asyncio.wait_for(ws.recv(), timeout=30)
                print("RECV " + msg, flush=True)
        except asyncio.TimeoutError:
            print("TIMEOUT no message in 30s", flush=True)
        except Exception as e:
            print("ERR " + repr(e), flush=True)

asyncio.run(main())
