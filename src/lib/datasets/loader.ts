import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse';

export interface SequenceData {
  ID: string;
  DNA_Sequence: string;
  Disease: string;
  Source_DB: string;
  DB_Accession: string;
}

export interface ParameterData {
  ID: string;
  Disease: string;
  Mutation_Rate: number;
  Gene_Expression: number;
  Methylation_Level: number;
  Clinical_Score: number;
  Variant_Impact: number;
  Population_Frequency: number;
  Source_DB: string;
}

export interface CombinedData {
  id: string;
  sequence: string;
  disease: string;
  parameters: {
    mutation_rate: number;
    gene_expression: number;
    methylation_level: number;
    clinical_score: number;
    variant_impact: number;
    population_frequency: number;
  };
  sources: {
    sequence_db: string;
    parameter_db: string;
    accession: string;
  };
}

export const loadDatasets = async (): Promise<CombinedData[]> => {
  const sequencesPath = path.join(process.cwd(), 'src', 'lib', 'datasets', 'sequences.csv');
  const parametersPath = path.join(process.cwd(), 'src', 'lib', 'datasets', 'parameters.csv');

  const sequencesFile = fs.readFileSync(sequencesPath, 'utf-8');
  const parametersFile = fs.readFileSync(parametersPath, 'utf-8');

  const sequences: SequenceData[] = (Papa.parse(sequencesFile, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  }).data as unknown) as SequenceData[];

  const parameters: ParameterData[] = Papa.parse<ParameterData>(parametersFile, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  }).data as ParameterData[];

  // Combine the datasets
  return sequences.map((seq) => {
    const param = parameters.find((p) => p.ID === seq.ID);
    if (!param) {
      throw new Error(`No parameters found for sequence ${seq.ID}`);
    }

    return {
      id: seq.ID,
      sequence: seq.DNA_Sequence,
      disease: seq.Disease,
      parameters: {
        mutation_rate: param.Mutation_Rate,
        gene_expression: param.Gene_Expression,
        methylation_level: param.Methylation_Level,
        clinical_score: param.Clinical_Score,
        variant_impact: param.Variant_Impact,
        population_frequency: param.Population_Frequency,
      },
      sources: {
        sequence_db: seq.Source_DB,
        parameter_db: param.Source_DB,
        accession: seq.DB_Accession,
      },
    };
  });
};
