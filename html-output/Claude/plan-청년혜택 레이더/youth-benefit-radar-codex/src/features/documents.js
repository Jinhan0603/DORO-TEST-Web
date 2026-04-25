export function getDocumentProgress(policy, progress) {
  const requiredDocuments = policy.requiredDocuments.filter((document) => document.required);
  const checkedIds = new Set(progress?.checkedDocumentIds ?? []);
  const completed = requiredDocuments.filter((document) => checkedIds.has(document.id)).length;
  const total = requiredDocuments.length;
  const percent = total === 0 ? 100 : Math.round((completed / total) * 100);
  return { total, completed, percent };
}
