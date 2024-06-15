import { Injectable } from '@nestjs/common';
import { CreateFile3Dto } from './dto/create-file3.dto';
import { UpdateFile3Dto } from './dto/update-file3.dto';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs-extra';
import * as crypto from 'crypto';
import { promisify } from 'util';
import { pipeline } from 'stream';

@Injectable()
export class File3Service {
  constructor(private readonly jwtService: JwtService) {}
  private algorithm = 'aes-256-cbc';
  private key = crypto.randomBytes(32); // 256-bit key
  private iv = crypto.randomBytes(16); // 128-bit IV
  // encryptedFile =
  //   'C:/Users/dw/Desktop/Nest.js/all_nestjs/nestjs/src/file3/save3/sqldump3.txt';
  async encryptFile(filePath: string): Promise<string> {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    const input = fs.createReadStream(filePath);
    // 암호화된 파일 저장
    const encryptedFilePath = `C:/Users/dw/Desktop/Nest.js/all_nestjs/nestjs/src/file3/save3/sqldump3.txt.enc`;
    const output = fs.createWriteStream(encryptedFilePath);

    // 스트림을 promisify하여 async/await로 처리
    const pipelineAsync = promisify(pipeline);

    try {
      await pipelineAsync(input, cipher, output);
      return encryptedFilePath;
    } catch (err) {
      throw new Error(`File encryption failed: ${err.message}`);
    }
  }

  generateQueryToken(filePath: string): string {
    return this.jwtService.sign({ filePath });
  }

  verifyQueryToken(token: string): any {
    return this.jwtService.verify(token);
  }

  async decryptFile(filePath: string): Promise<string> {
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    const input = fs.createReadStream(filePath);
    const decryptedFilePath = filePath.replace('.enc', '');
    const output = fs.createWriteStream(decryptedFilePath);

    const pipelineAsync = promisify(pipeline);

    try {
      await pipelineAsync(input, decipher, output);
      return decryptedFilePath;
    } catch (err) {
      throw new Error(`File decryption failed: ${err.message}`);
    }
  }
}
