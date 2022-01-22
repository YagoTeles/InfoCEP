const puppeteer = require('puppeteer');
const readlineSync = require('readline-sync');


async function buscacep() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const cep = readlineSync.question('Informe o CEP: ');
  console.log();
  const urlcorreios ='https://buscacepinter.correios.com.br/app/endereco/index.php'
  await page.goto(urlcorreios);
  await page.type('#endereco',cep);
  await page.click('#btn_pesquisar');
  await page.waitForTimeout(200); //Tempo nescessario para as informaçoes serem exibidas.
  const verificar = await page.$eval('#mensagem-resultado', texto => texto.textContent);

    //Verificar se existe dados no site dos correios referente ao CEP informado.
    if(verificar == 'Não há dados a serem exibidos'){
        console.log(`Não foi encontrado resultados para o CEP: ${cep}`)
        await browser.close();
    }

    else{
        const infocep = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("#resultado-DNEC > tbody > tr > td")).map(x => x.textContent);
        })
        console.log(infocep.join("\n"));
        await browser.close();
    }
}

buscacep();