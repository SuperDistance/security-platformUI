# security-platformUI
A demo about how to encrypt and decrypt RSA/AES/DES through Vue.js and Spring Boot

#演示地址：123.56.49.65:8080
前端加密库：CryptoJS（消息摘要、DES/AES）、JSEncrypt（RSA加密）
后端加密库：Jasypt (消息摘要)、javax.crypto(DES/AES, JDK 8自带)
java.security(RSA密钥生成、解密、数字签名)、apache commons-codec(Base64转码库)

具有较完整的图形化界面；
使用MD5、SHA系列算法，实现消息摘要，确保消息的完整性； 
使用DES、AES等算法实现对称加密，确保消息的机密性； 
使用RSA算法，实现公钥加密，且用私钥解密，比较不对称加密和对称加密的性能； 
实现基于数字证书的数字签名和验证（含证书的生成和创建）

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
