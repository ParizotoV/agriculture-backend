import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CpfCnpjValidationPipe implements PipeTransform<string> {
  transform(value: string): string {
    if (!value) {
      throw new BadRequestException('Informe um CPF/CNPJ válido.');
    }

    const onlyDigits = value.replace(/\D/g, '');

    if (onlyDigits.length === 11) {
      if (!this.isValidCPF(onlyDigits)) {
        throw new BadRequestException('CPF inválido');
      }
      return onlyDigits;
    }

    if (onlyDigits.length === 14) {
      if (!this.isValidCNPJ(onlyDigits)) {
        throw new BadRequestException('CNPJ inválido');
      }
      return onlyDigits;
    }

    throw new BadRequestException('Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válidos.');
  }

  private isValidCPF(cpf: string): boolean {
    if (!/^\d{11}$/.test(cpf)) return false;

    if (/^(\d)\1{10}$/.test(cpf)) return false;

    const calcCheckDigit = (digits: string, factor: number): number => {
      let sum = 0;
      for (const d of digits) {
        sum += parseInt(d, 10) * factor--;
      }
      const mod = sum % 11;
      return mod < 2 ? 0 : 11 - mod;
    };

    const firstNine = cpf.slice(0, 9);
    const firstCheck = calcCheckDigit(firstNine, 10);
    const secondCheck = calcCheckDigit(firstNine + firstCheck, 11);

    return (
      firstCheck === parseInt(cpf.charAt(9), 10) && secondCheck === parseInt(cpf.charAt(10), 10)
    );
  }

  private isValidCNPJ(cnpj: string): boolean {
    if (!/^\d{14}$/.test(cnpj)) return false;

    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    const calcCheckDigit = (digits: string, factors: number[]): number => {
      let sum = 0;
      for (let i = 0; i < digits.length; i++) {
        sum += parseInt(digits.charAt(i), 10) * factors[i];
      }
      const mod = sum % 11;
      return mod < 2 ? 0 : 11 - mod;
    };

    const firstTwelve = cnpj.slice(0, 12);
    const factor1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const firstCheck = calcCheckDigit(firstTwelve, factor1);

    const firstThirteen = firstTwelve + firstCheck;
    const factor2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const secondCheck = calcCheckDigit(firstThirteen, factor2);

    return (
      firstCheck === parseInt(cnpj.charAt(12), 10) && secondCheck === parseInt(cnpj.charAt(13), 10)
    );
  }
}
