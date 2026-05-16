/**
 * Seed inicial: popula a tabela `servicos` com dados reais do Studio Elegance.
 * Execute com: npm run db:seed
 */

require('dotenv').config({ path: '../.env' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const servicos = [
  // Cabelo
  {
    categoria: 'cabelo',
    nome: 'Corte Feminino',
    descricao: 'Corte personalizado com lavagem e finalização.',
    preco: 120.00,
    duracao_minutos: 60,
    imagem_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
    ativo: true,
  },
  {
    categoria: 'cabelo',
    nome: 'Coloração Completa',
    descricao: 'Coloração profissional com produtos de alta qualidade.',
    preco: 280.00,
    duracao_minutos: 150,
    imagem_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    ativo: true,
  },
  {
    categoria: 'cabelo',
    nome: 'Hidratação Profunda',
    descricao: 'Tratamento intensivo para restaurar o brilho e maciez.',
    preco: 160.00,
    duracao_minutos: 90,
    imagem_url: 'https://images.unsplash.com/photo-1519699689927-d2a0cf3cff2c?w=400',
    ativo: true,
  },
  // Unhas
  {
    categoria: 'unhas',
    nome: 'Manicure Clássica',
    descricao: 'Cuidado completo das unhas das mãos com esmaltação.',
    preco: 60.00,
    duracao_minutos: 45,
    imagem_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400',
    ativo: true,
  },
  {
    categoria: 'unhas',
    nome: 'Pedicure Spa',
    descricao: 'Tratamento relaxante para os pés com hidratação e esmaltação.',
    preco: 75.00,
    duracao_minutos: 60,
    imagem_url: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=400',
    ativo: true,
  },
  {
    categoria: 'unhas',
    nome: 'Unhas em Gel',
    descricao: 'Alongamento e modelagem em gel com design exclusivo.',
    preco: 180.00,
    duracao_minutos: 120,
    imagem_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400',
    ativo: true,
  },
  // Estética
  {
    categoria: 'estetica',
    nome: 'Limpeza de Pele',
    descricao: 'Limpeza profunda com extração e hidratação facial.',
    preco: 200.00,
    duracao_minutos: 75,
    imagem_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400',
    ativo: true,
  },
  {
    categoria: 'estetica',
    nome: 'Sobrancelha Design',
    descricao: 'Modelagem e design personalizado de sobrancelhas.',
    preco: 55.00,
    duracao_minutos: 30,
    imagem_url: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400',
    ativo: true,
  },
  {
    categoria: 'estetica',
    nome: 'Massagem Relaxante',
    descricao: 'Massagem corporal completa para alívio do estresse.',
    preco: 220.00,
    duracao_minutos: 60,
    imagem_url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
    ativo: true,
  },
];

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  await prisma.servicos.deleteMany();
  const criados = await prisma.servicos.createMany({ data: servicos });

  console.log(`✅ ${criados.count} serviços criados com sucesso.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
