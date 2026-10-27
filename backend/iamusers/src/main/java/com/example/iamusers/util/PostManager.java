package com.example.iamusers.util;

import java.util.concurrent.atomic.AtomicInteger;

public class PostManager {

    private static final AtomicInteger port = new AtomicInteger(9000);

    public static int getNextPort() {
        return port.getAndIncrement();
    }
}