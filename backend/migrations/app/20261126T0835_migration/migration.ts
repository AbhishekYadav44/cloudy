#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/9e586d6c47eba8cad0ca10567a82b8f5dd0db0c89f72496f5fb092e6cd0db0e0/contract';
import endContract from '../../snapshots/9e586d6c47eba8cad0ca10567a82b8f5dd0db0c89f72496f5fb092e6cd0db0e0/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/df4bd656e72f88877382f9b5036ef33520967087eea2b3f9da2627cd48723a97/contract';
import startContract from '../../snapshots/df4bd656e72f88877382f9b5036ef33520967087eea2b3f9da2627cd48723a97/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'Otp',
        column: col('verified', 'bool', {
          notNull: true,
          default: lit(false),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
