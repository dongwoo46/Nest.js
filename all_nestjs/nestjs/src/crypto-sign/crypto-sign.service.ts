import { Injectable } from '@nestjs/common';
import { CreateCryptoSignDto } from './dto/create-crypto-sign.dto';
import { UpdateCryptoSignDto } from './dto/update-crypto-sign.dto';

@Injectable()
export class CryptoSignService {
  create(createCryptoSignDto: CreateCryptoSignDto) {
    return 'This action adds a new cryptoSign';
  }

  findAll() {
    return `This action returns all cryptoSign`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cryptoSign`;
  }

  update(id: number, updateCryptoSignDto: UpdateCryptoSignDto) {
    return `This action updates a #${id} cryptoSign`;
  }

  remove(id: number) {
    return `This action removes a #${id} cryptoSign`;
  }
}
