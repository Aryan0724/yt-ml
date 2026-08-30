import asyncio
import httpx
import time

async def hit_analyze():
    async with httpx.AsyncClient() as client:
        with open("no_face_test.jpg", "rb") as f:
            files = {'thumbnail': ('no_face_test.jpg', f, 'image/jpeg')}
            data = {'title': 'Test', 'niche': 'Tech'}
            r = await client.post("http://127.0.0.1:8000/analyze", data=data, files=files, timeout=30.0)
            return r.status_code, r.text

async def main():
    print("Sending 3 concurrent requests...")
    results = await asyncio.gather(hit_analyze(), hit_analyze(), hit_analyze())
    for res in results:
        print(res)

if __name__ == "__main__":
    asyncio.run(main())
