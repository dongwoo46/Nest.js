import { DataSource, Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { CustomRepository } from './typeorm/typeorm-ex.decorator';
import { title } from 'process';

@CustomRepository(Report)
export class ReportsRepository extends Repository<Report> {
  async customSave(entity: Report): Promise<Report> {
    // Your custom logic here before saving
    return this.save(entity);
  }

  findAll() {
    return this.find();
  }
  async findOneById(id: number): Promise<Report | undefined> {
    return this.findOneBy({ id: id });
  }

  async findByTitle(title: string): Promise<Report | undefined> {
    return this.findOneBy({ title: title });
  }
}
