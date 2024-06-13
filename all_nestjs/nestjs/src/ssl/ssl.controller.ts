import { Controller, Post, Body } from '@nestjs/common';
import { SslService } from './ssl.service';
import { Public } from 'src/auth/public.decorator';

@Controller('ssl')
export class SslController {
  constructor(private readonly sslService: SslService) {}

  @Post('/generate')
  @Public()
  async generateCsr(
    @Body('commonName') commonName: string,
    @Body('countryName') countryName: string,
    @Body('organizationName') organizationName: string,
    @Body('organizationalUnitName') organizationalUnitName: string,
    @Body('emailAddress') emailAddress: string,
  ) {
    const { privateKey, csr } = this.sslService.generateCsr(
      commonName,
      countryName,
      organizationName,
      organizationalUnitName,
      emailAddress,
    );
    return { privateKey, csr };
  }

  @Post('sign')
  @Public()
  async signCsr(@Body('csr') csr: string) {
    const certificate = this.sslService.signCsr(csr);
    return { certificate };
  }
}
