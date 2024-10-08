import pyopencl as cl
import numpy as np


# Create a context and command queue
platform = cl.get_platforms()[0]  # Get the first platform
device = platform.get_devices()[0]  # Get the first device
context = cl.Context([device])
queue = cl.CommandQueue(context)

# Prepare data
a_np = np.array([1, 2, 3, 4], dtype=np.float32)
b_np = np.array([5, 6, 7, 8], dtype=np.float32)

# Create buffers
a_buf = cl.Buffer(context, cl.mem_flags.READ_ONLY | cl.mem_flags.COPY_HOST_PTR, hostbuf=a_np)
b_buf = cl.Buffer(context, cl.mem_flags.READ_ONLY | cl.mem_flags.COPY_HOST_PTR, hostbuf=b_np)
c_buf = cl.Buffer(context, cl.mem_flags.WRITE_ONLY, b_np.nbytes)

# OpenCL kernel
program = cl.Program(context, """
__kernel void add(__global const float *a, __global const float *b, __global float *c) {
    int gid = get_global_id(0);
    c[gid] = a[gid] + b[gid];
}
""").build()

# Execute the kernel
program.add(queue, a_np.shape, None, a_buf, b_buf, c_buf)

# Retrieve results
c_np = np.empty_like(a_np)
cl.enqueue_copy(queue, c_np, c_buf)

print(c_np)  # Output should be [6, 8, 10, 12]


platforms = cl.get_platforms()
for platform in platforms:
    devices = platform.get_devices()
    for device in devices:
        print(f"Device: {device.name}, Type: {cl.device_type.to_string(device.type)}")