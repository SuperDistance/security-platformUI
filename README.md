# security-platformUI
A demo about how to encrypt and decrypt RSA/AES/DES through Vue.js and Spring Boot
## Tentative Display：123.56.49.65:8080
``` bash
Libraries and Dependencies：
Frontend：CryptoJS（Message Digest、DES/AES）、JSEncrypt（RSA Encryption）
Backend：Jasypt (Message Digest)、javax.crypto(DES/AES, in JDK 8)
java.security(to generate keys and encrypt RSA, Digital Signiture)、apache commons-codec(Base64 decode and encode)
```
## Features:
``` bash
1. The algorithoms used are paired to the backend. 
2. To visialize the process of the digital certification including a simple CA.
    Also add verify mechanism to verify whether the message has been distorted or the certification is error.
3. Add Time-meter to compare the performance.
4. Message Digest: The use of MD5, SHA-1, SHA-256, SHA-512.
5. Symmestrical Encryption: The use of DES(ECB Mode) and AES(BCB Mode).
6. Assymmetrical Encryption: The use of RSA (with 1024 key length) whose key generated from backend.
```
