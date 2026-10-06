'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createBusiness(data: any) {
    const res = await prisma.business.create({ data });
    revalidatePath('/', 'layout');
    return res;
}

export async function deleteBusiness(id: string) {
    const res = await prisma.business.delete({ where: { id } });
    revalidatePath('/', 'layout');
    return res;
}

export async function createPost(data: any) {
    const res = await prisma.post.create({ data });
    revalidatePath('/', 'layout');
    return res;
}

export async function createIdea(data: any) {
    const res = await prisma.idea.create({ data });
    revalidatePath('/', 'layout');
    return res;
}

export async function createTransaction(data: any) {
    const res = await prisma.transaction.create({ data });
    revalidatePath('/', 'layout');
    return res;
}

export async function createInventoryItem(data: any) {
    const res = await prisma.inventoryItem.create({ data });
    revalidatePath('/', 'layout');
    return res;
}

export async function updateInventoryItemDB(id: string, data: any) {
    const res = await prisma.inventoryItem.update({ where: { id }, data });
    revalidatePath('/', 'layout');
    return res;
}

export async function createDecision(data: any) {
    const res = await prisma.decision.create({ data });
    revalidatePath('/', 'layout');
    return res;
}

export async function createVendor(data: any) {
    const res = await prisma.vendor.create({ data });
    revalidatePath('/', 'layout');
    return res;
}

export async function createSocialAccount(data: any) {
    const res = await prisma.socialAccount.create({ data });
    revalidatePath('/', 'layout');
    return res;
}
