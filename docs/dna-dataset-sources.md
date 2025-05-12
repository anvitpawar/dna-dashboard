# Data Sources for DNA Dataset

The DNA dataset was created by merging data from the following sources:

1. **GenBank**
   - Description: A comprehensive public database of nucleotide sequences and supporting bibliographic and biological annotation.
   - Reference: [GenBank](https://www.ncbi.nlm.nih.gov/genbank/)

2. **1000 Genomes Project**
   - Description: A deep catalog of human genetic variation.
   - Reference: [1000 Genomes Project](https://www.internationalgenome.org/)

3. **ClinVar**
   - Description: A freely accessible, public archive of reports of the relationships among human variations and phenotypes.
   - Reference: [ClinVar](https://www.ncbi.nlm.nih.gov/clinvar/)

4. **Ensembl**
   - Description: A genome browser for vertebrate genomes.
   - Reference: [Ensembl](https://www.ensembl.org/)

5. **GEO (Gene Expression Omnibus)**
   - Description: A public repository that archives and freely distributes microarray, next-generation sequencing, and other forms of high-throughput functional genomic data.
   - Reference: [GEO](https://www.ncbi.nlm.nih.gov/geo/)

---

## Dataset Creation Methodology

The final DNA dataset was created by merging data from the following datasets:

1. **GenBank Sequences**
   - Source: GenBank
   - Data: Raw nucleotide sequences.
   - Usage: Provided the foundational DNA sequences for analysis.

2. **1000 Genomes Project Variants**
   - Source: 1000 Genomes Project
   - Data: Genetic variants and population frequency data.
   - Usage: Added population frequency and variant impact parameters.

3. **ClinVar Clinical Annotations**
   - Source: ClinVar
   - Data: Clinical significance of genetic variants.
   - Usage: Incorporated clinical scores and disease associations.

### Merging Process

1. **Sequence Alignment**
   - Sequences from GenBank were aligned with variant data from the 1000 Genomes Project.

2. **Parameter Integration**
   - Clinical annotations from ClinVar were mapped to the aligned sequences.

3. **Final Dataset**
   - The merged data was validated and exported as a CSV file for analysis.

---

For more details, refer to the individual data source documentation linked above.
