import { Injectable } from '@nestjs/common';
import { CreateEccSignDto } from './dto/create-ecc-sign.dto';
import { UpdateEccSignDto } from './dto/update-ecc-sign.dto';
import { ec as EC, Signature as ECSignature } from 'elliptic';

@Injectable()
export class EccSignService {
  private ec: EC;
  private keyPair: EC.KeyPair;

  constructor() {
    this.ec = new EC('secp256k1');
    this.keyPair = this.ec.genKeyPair();
  }

  getKeys() {
    return {
      privateKey: this.keyPair.getPrivate('hex'),
      publicKey: this.keyPair.getPublic('hex'),
    };
  }

  createEccSignature(data: string): string {
    const msgHash = this.ec.hash().update(data).digest('hex');

    const signature = this.keyPair.sign(msgHash);
    return signature.toDER('hex');
  }

  verifyEccSignature(
    data: string,
    publicKey: string,
    signature: string,
  ): boolean {
    const msgHash = this.ec.hash().update(data).digest('hex');
    const publicKeyObj = this.ec.keyFromPublic(publicKey, 'hex');
    const verify = this.ec.verify(msgHash, signature, publicKeyObj);
    return verify;
  }

  create(createEccSignDto: CreateEccSignDto) {
    return 'This action adds a new eccSign';
  }

  findAll() {
    return `This action returns all eccSign`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eccSign`;
  }

  update(id: number, updateEccSignDto: UpdateEccSignDto) {
    return `This action updates a #${id} eccSign`;
  }

  remove(id: number) {
    return `This action removes a #${id} eccSign`;
  }
}
