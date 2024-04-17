import { PDF417Type } from './Commands';
import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import Printer from '../printer/Printer';
import { Storage } from '@ionic/storage';
import Image from '../printer/Image';
import { RasterMode, Justification, QRErrorCorrectLevel, Color, CodeTable, Barcode, Font, Position } from '../printer/Commands';
import { Console } from '../printer/Adapters';

@Injectable({
   providedIn: 'root'
})
export class Imprimir {

    empresa: any;
    pdf417: any = '';
    logomarca: any = '';

    constructor(
      private bluetoothSerial: BluetoothSerial,
      private storage: Storage
    ) {
     }
    async printPassagem(data: any) {
      data = atob(data);
      console.log('data atob: ', data);

      data = unescape(encodeURIComponent(data));
      console.log('data encode utf8: ', data);

      this.bluetoothSerial.write(data).then(function(success) {
          console.log('Enviou para impressora' + success);

        }, function(error) {
          console.log(error);
        });
    }
    async print(data: any, retorno: any, empresa, urlPDF417: any = null ) {
      
      console.log('Data Imprimir: ', data);
      console.log('Retorno: ', retorno);
      if (retorno !== null && retorno[0] !== null) {
        retorno = JSON.parse(atob(retorno));
        
      }
      const passagem = JSON.parse(data.viagem);
      this.empresa = empresa;

      
      const passageiros = JSON.parse(data.passageiros);
      const pagamentos = JSON.parse(data.pagamento);


      const valorComodo = data.valorComodo;
      const valorDesconto = data.valorDesconto;
      const valorTotal = data.valorTotal;

      if (this.empresa.logomarca !== '') {
        this.logomarca = await Image.load(this.empresa.logomarca);
      }

      const adapter = new Console(console.log, 64);
      const printer = await new Printer(adapter).open();
      console.log('Qtd Passageiros: ', passageiros.length);

      for (let i = 0; i < passageiros.length; i++) {
        
        if (urlPDF417 !== null) {
          this.pdf417 = await Image.load(urlPDF417[i]);
          console.log('pdf: ',this.pdf417);
        }

        const convenio = passageiros[i].convenio;
        const comodo = passageiros[i].comodo;

        const dataEmbarque = new Date(passagem.data_embarque);

        await printer.init()
                 .setFont(Font.A)
                 .setJustification(Justification.Center);
        if (this.logomarca !== '') {
          await printer.raster(this.logomarca, RasterMode.Normal)
                 .writeLine('');
        }
        await printer.setBold(true)
                 .writeLine(this.empresa.xnome)
                 .setBold(false)
                 .writeLine('CNPJ: ' + this.empresa.cnpj_cpf + ' IE: ' + this.empresa.ie)
                 .writeLine(this.empresa.endereco)
                 .writeLine('Documento Auxiliar do Bilhete de Passagem Eletrônico')
                 .writeLine(passagem.nomeEmbarcacao.toUpperCase())
                 .writeLine('');
        if (retorno !== null) {
          if (retorno[i] !== '' && retorno[i] !== null) {
            if (retorno[i].tpAmb === 2) {
              await printer.writeLine('EMITIDO EM AMBIENTE DE HOMOLOGAÇÃO')
                          .writeLine('SEM VALOR FISCAL');
            }
            if (retorno[i].retorno && retorno[i].retorno.cStat !== '100') {
              await printer.writeLine('')
                      .writeLine('EMITIDA EM CONTINGÊNCIA')
                      .writeLine('Pendente de autorização')
                      .writeLine(' ');
            }
          }
        } else {
          await printer
                    .writeLine('EMITIDA EM CONTINGÊNCIA')
                    .writeLine('Pendente de autorização');
        }
        await printer.writeLine('')
                 .write('Origem: ')
                 .setBold(true)
                 .write(passagem.origem.toUpperCase() + ' ')
                 .setBold(false)
                 .write('Destino: ')
                 .setBold(true)
                 .write(passagem.destino.toUpperCase() + '\n')
                 .setBold(false)
                 .writeLine('Data: ' + dataEmbarque.toLocaleDateString() + ' | Horário: ' + dataEmbarque.toLocaleTimeString());
        if (passagem.categoriaEmbarcacao === '3') {
          await printer.setBold(true)
            .writeLine('(Poltrona:' + comodo.numeracao + ')');
        }
        const valorDesconto = (convenio.desconto * comodo.valor) / 100;
        const valorTotal = comodo.valor - valorDesconto;

        await printer.writeLine('')
                 .writeLine('Linha: ' + passagem.origemViagem + ' x ' + passagem.destinoViagem)
                 .writeLine('Tipo: Convencional com sanitário')
                 .writeLine('')
                 .write('Tarifa'.padEnd(16, ' '))
                 .write((parseFloat(comodo.valor)
                    .toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '\n')
                    .padStart(16, ' '))
                    .write('Taxa de Embarque'.padEnd(16, ' '))
                 .write((parseFloat(passagem.taxa_embarque)
                    .toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '\n')
                    .padStart(16, ' '))
                 .write('Valor Total R$'.padEnd(16, ' '))
                 .write((parseFloat(comodo.valor + passagem.taxa_embarque)
                    .toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '\n')
                    .padStart(16, ' '))
                 .write('Desconto R$'.padEnd(16, ' '))
                 .write((valorDesconto
                    .toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '\n')
                    .padStart(16, ' '))
                 .setBold(true)
                 .write('Valor a Pagar R$'.padEnd(16, ' '))
                 .write((valorTotal
                    .toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '\n')
                    .padStart(16, ' '))
                 .setBold(false)
                 .writeLine('')
                 .write('FORMA PAGAMENTO'.padEnd(16, ' '))
                 .write('VALOR PAGO R$\n'.padStart(16, ' '));
        let valorPago = 0;
        for (let p = 0; p < pagamentos.length; p++) {
          const valor = (pagamentos[p].valor / passageiros.length);
          valorPago = valorPago + valor;
          await printer.write(pagamentos[p].nome.padEnd(16, ' '))
                  .write((valor
                    .toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2}) +
                    '\n')
                    .padStart(16, ' '));
        }
        const troco = valorPago - valorTotal;
        await printer.write('Troco'.padEnd(16, ' '))
                    .write((troco
                        .toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + '\n')
                        .padStart(16, ' '))
                    .writeLine('');
        if (retorno !== null && retorno[0] !== null) {
          if (retorno[i] !== '' && retorno[i] !== null) {

            if (retorno[i].chave_acesso !== '') {
              await printer.writeLine('Consulte pela Chave de Acesso em')
                      .setBold(true)
                      .writeLine('https://dfe-portal.svrs.rs.gov.br/BPE/Consulta')
                      .setBold(false)
                      .writeLine(retorno[i].chave_acesso)
                      .writeLine(' ')
                      .writeLine('PASSAGEIRO: DOC ' + passageiros[i].ndoc + ' - ' + passageiros[i].nome);
    
              if (convenio.tipo != null) {
                await printer.writeLine('TIPO DE DESCONTO: ' + convenio.tipo);
              }
    
              await printer.writeLine(' ')
                      .write('BP-e n. ')
                      .write(retorno[i].numero_bpe.toString().padStart(9, '0'))
                      .write(' Série ')
                      .write(retorno[i].serie.toString().padStart(3, '0'))
                      .write(' ' + retorno[i].data_emissao)
                      .writeLine(' ');
              
              if (retorno[i].retorno && retorno[i].retorno.cStat === '100') {
                const protBPe =   retorno[i].retorno.protBPe;
                console.log(protBPe);
                const date = new Date(protBPe.infProt.dhRecbto);
    
    
                await printer.writeLine('Protocolo de autorização: ' + protBPe.infProt.nProt)
                      .writeLine(' ')
                      .writeLine('Data de autorização: ' + date.toLocaleString())
                      .writeLine(' ');
              } else {
                await printer.writeLine('')
                      .writeLine('EMITIDA EM CONTINGÊNCIA')
                      .writeLine('Pendente de autorização')
                      .writeLine(' ');
              }

              console.log('https://dfe-portal.svrs.rs.gov.br/bpe/qrCode?chBPe='
              + retorno[i].chave
              + '&tpAmb=' + retorno[i].tpAmb);

              if (urlPDF417 !== null) {
                await printer.raster(this.pdf417, RasterMode.Normal)
                            .writeLine('');
              }
                          
                      //.pdf417('12345678933333333344', PDF417Type.Truncated)
                      //.writeLine(' ')
                await printer.qr('https://dfe-portal.svrs.rs.gov.br/bpe/qrCode?chBPe='
                        + retorno[i].chave
                        + '&tpAmb=' + retorno[i].tpAmb, QRErrorCorrectLevel.L, 2)
                      .writeLine(' ')
                      .writeLine('Tributos Totais Incidentes (Lei Federal 12.741/2012): ' +
                      ((valorTotal * 6) / 100).toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2}));
                await printer.writeLine(' ')
                      .writeLine('Compre online em yjaraviagens.com')
                      .feed(4)
                      .cut(true);
            }
          }
        } else {
          
          await printer.writeLine(' ')
                     .writeLine('PASSAGEIRO: DOC ' + passageiros[i].ndoc + ' - ' + passageiros[i].nome);
          if (convenio.tipo != null) {
            await printer.writeLine('TIPO DE DESCONTO: ' + convenio.tipo);
          }
          if (urlPDF417 !== null) {
            await printer.raster(this.pdf417, RasterMode.Normal)
                        .writeLine('');
          }
          await printer.writeLine(' ')
                       .writeLine('Compre online em yjaraviagens.com');
          await printer.feed(2)
                      .cut(true);
        }
      }

      const output = await printer.flushReturn();
        console.log('Output', output);

         // return output;
        this.bluetoothSerial.write(output).then(function(success) {
          console.log('Enviou para impressora ' + success);

        }, function(error) {
          console.log(error);
        });
    }
}
