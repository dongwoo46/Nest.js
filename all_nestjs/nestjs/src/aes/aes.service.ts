import { Injectable } from '@nestjs/common';
import { CreateAeDto } from './dto/create-ae.dto';
import { UpdateAeDto } from './dto/update-ae.dto';
import * as crypto from 'crypto';
import * as fs from 'fs';

@Injectable()
export class AesService {
  private readonly algorithm = 'aes-256-cbc';

  private generateKey(key: string): Buffer {
    return crypto.createHash('sha256').update(key).digest();
  }

  private generateIv(iv: string): Buffer {
    return crypto.createHash('md5').update(iv).digest();
  }

  encryptObjectToFile(
    obj: any,
    key: string,
    iv: string,
    outputFilePath: string,
  ): void {
    const jsonString = JSON.stringify(obj);
    const keyBuffer = this.generateKey(key);
    const ivBuffer = this.generateIv(iv);

    const cipher = crypto.createCipheriv(this.algorithm, keyBuffer, ivBuffer);
    const encrypted = Buffer.concat([
      cipher.update(jsonString, 'utf8'),
      cipher.final(),
    ]);

    fs.writeFileSync(outputFilePath, encrypted);
  }

  decryptFileToObject(filePath: string, key: string, iv: string): any {
    const keyBuffer = this.generateKey(key);
    const ivBuffer = this.generateIv(iv);
    console.log(keyBuffer);
    console.log(ivBuffer);
    const encryptedData = fs.readFileSync(filePath);

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      keyBuffer,
      ivBuffer,
    );
    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    const jsonString = decrypted.toString('utf8');
    return JSON.parse(jsonString);
  }

  create(createAeDto: CreateAeDto) {
    return 'This action adds a new ae';
  }

  findAll() {
    return `This action returns all aes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ae`;
  }

  update(id: number, updateAeDto: UpdateAeDto) {
    return `This action updates a #${id} ae`;
  }

  remove(id: number) {
    return `This action removes a #${id} ae`;
  }
}
