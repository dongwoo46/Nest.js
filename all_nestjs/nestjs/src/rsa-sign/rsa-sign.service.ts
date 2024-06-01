import { Injectable } from '@nestjs/common';
import { CreateRsaSignDto } from './dto/create-rsa-sign.dto';
import { UpdateRsaSignDto } from './dto/update-rsa-sign.dto';
import { createSign, createVerify, generateKeyPairSync } from 'crypto';

@Injectable()
export class RsaSignService {
  generateKeys() {
    // RSA 키 쌍 생성
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });
    return { privateKey, publicKey };
  }

  createSignature(data, privateKey) {
    const sign = createSign('SHA256');
    sign.update(data);
    sign.end();
    return sign.sign(privateKey, 'hex');
  }

  verifySignature(data, publicKey, signature) {
    const verify = createVerify('SHA256');
    verify.update(data);
    verify.end();
    return verify.verify(publicKey, signature, 'hex');
  }

  create(createRsaSignDto: CreateRsaSignDto) {
    return 'This action adds a new rsaSign';
  }

  findAll() {
    return `This action returns all rsaSign`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rsaSign`;
  }

  update(id: number, updateRsaSignDto: UpdateRsaSignDto) {
    return `This action updates a #${id} rsaSign`;
  }

  remove(id: number) {
    return `This action removes a #${id} rsaSign`;
  }
}
