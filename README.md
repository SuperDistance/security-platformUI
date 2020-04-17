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
