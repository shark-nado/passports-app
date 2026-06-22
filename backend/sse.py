import asyncio
import json
from collections import defaultdict


class SSEManager:
    """Manages Server-Sent Events connections per location."""

    def __init__(self):
        self._queues: dict[str, list[asyncio.Queue]] = defaultdict(list)

    def subscribe(self, location_id: str) -> asyncio.Queue:
        queue: asyncio.Queue = asyncio.Queue()
        self._queues[location_id].append(queue)
        return queue

    def unsubscribe(self, location_id: str, queue: asyncio.Queue):
        queues = self._queues.get(location_id, [])
        if queue in queues:
            queues.remove(queue)

    async def publish(self, location_id: str, event: str, data: dict):
        """Push an event to all subscribers for a location."""
        queues = self._queues.get(location_id, [])
        message = f"event: {event}\ndata: {json.dumps(data)}\n\n"
        for queue in queues:
            await queue.put(message)


sse_manager = SSEManager()
