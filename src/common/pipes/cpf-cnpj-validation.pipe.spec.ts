import { BadRequestException } from '@nestjs/common';
import { CpfCnpjValidationPipe } from './cpf-cnpj-validation.pipe';

describe('CpfCnpjValidationPipe', () => {
  let pipe: CpfCnpjValidationPipe;

  beforeEach(() => {
    pipe = new CpfCnpjValidationPipe();
  });

  it('deve retornar apenas dígitos quando CPF válido for informado', () => {
    // CPF de exemplo: 529.982.247-25 é um CPF válido de teste
    const input = '529.982.247-25';
    const result = pipe.transform(input);
    expect(result).toBe('52998224725');
  });

  it('deve lançar BadRequestException para CPF inválido', () => {
    // CPF com dígitos repetidos ou checksum incorreto
    const invalidCpf = '111.111.111-11';
    expect(() => pipe.transform(invalidCpf)).toThrow(BadRequestException);
    try {
      pipe.transform(invalidCpf);
    } catch (err: any) {
      expect(err.message).toBe('CPF inválido');
    }
  });

  it('deve retornar apenas dígitos quando CNPJ válido for informado', () => {
    // CNPJ de exemplo: 11.444.777/0001-61 é um CNPJ válido de teste
    const input = '11.444.777/0001-61';
    const result = pipe.transform(input);
    expect(result).toBe('11444777000161');
  });

  it('deve lançar BadRequestException para CNPJ inválido', () => {
    // CNPJ com dígitos repetidos ou checksum incorreto
    const invalidCnpj = '11.111.111/1111-11';
    expect(() => pipe.transform(invalidCnpj)).toThrow(BadRequestException);
    try {
      pipe.transform(invalidCnpj);
    } catch (err: any) {
      expect(err.message).toBe('CNPJ inválido');
    }
  });

  it('deve lançar BadRequestException quando string for vazia ou falsy', () => {
    expect(() => pipe.transform('')).toThrow(BadRequestException);
    try {
      pipe.transform('');
    } catch (err: any) {
      expect(err.message).toBe('Informe um CPF/CNPJ válido.');
    }
  });

  it('deve lançar BadRequestException quando comprimento não for 11 nem 14 dígitos', () => {
    // Exemplo com 10 dígitos
    const shortValue = '123.456.789-0';
    expect(() => pipe.transform(shortValue)).toThrow(BadRequestException);
    try {
      pipe.transform(shortValue);
    } catch (err: any) {
      expect(err.message).toBe('Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válidos.');
    }
  });
});
