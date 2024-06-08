import { Injectable } from '@nestjs/common';
import * as forge from 'node-forge';
import * as fs from 'fs';
import axios from 'axios';
import * as path from 'path';

@Injectable()
export class SslService {
  generateCsr(
    commonName: string,
    countryName: string,
    organizationName: string,
    organizationalUnitName: string,
    emailAddress: string,
  ): { privateKey: string; csr: string } {
    const keys = forge.pki.rsa.generateKeyPair(2048);
    const csr = forge.pki.createCertificationRequest();
    csr.publicKey = keys.publicKey;
    csr.setSubject([
      { name: 'commonName', value: commonName },
      { name: 'countryName', value: countryName },
      { name: 'organizationName', value: organizationName },
      { name: 'organizationalUnitName', value: organizationalUnitName },
      { name: 'emailAddress', value: emailAddress },
    ]);
    csr.sign(keys.privateKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);
    const csrPem = forge.pki.certificationRequestToPem(csr);

    // 파일을 저장할 디렉토리 경로 설정
    const dir = path.join(__dirname, '..', 'certs');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 파일 경로 설정
    const privateKeyPath = path.join(dir, 'privateKey.key');
    const csrPath = path.join(dir, 'certificateRequest.csr');

    // 파일 저장
    fs.writeFileSync(privateKeyPath, privateKeyPem);
    fs.writeFileSync(csrPath, csrPem);

    console.log('Files saved:', privateKeyPath, csrPath);

    return { privateKey: privateKeyPem, csr: csrPem };
  }

  signCsr(csrPem: string): string {
    const caKeyPem = fs.readFileSync('path/to/caKey.key', 'utf8');
    const caCertPem = fs.readFileSync('path/to/caCert.crt', 'utf8');
    const caKey = forge.pki.privateKeyFromPem(caKeyPem);
    const caCert = forge.pki.certificateFromPem(caCertPem);

    const csr = forge.pki.certificationRequestFromPem(csrPem);
    if (!csr.verify()) {
      throw new Error('CSR verification failed');
    }

    const cert = forge.pki.createCertificate();
    cert.serialNumber = new Date().getTime().toString();
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(
      cert.validity.notBefore.getFullYear() + 1,
    );

    cert.setSubject(csr.subject.attributes);
    cert.setIssuer(caCert.subject.attributes);
    cert.publicKey = csr.publicKey;
    cert.sign(caKey, forge.md.sha256.create());

    const certPem = forge.pki.certificateToPem(cert);
    return certPem;
  }
}
