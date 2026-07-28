const fs = require('fs');
let code = fs.readFileSync('src/components/ProjectDashboard.tsx', 'utf8');

code = code.replace(
  `                        {project.dueDate && (
                          <span className="flex items-center gap-1"><Clock size={12}/> {new Date(project.dueDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 line-clamp-2 min-h-[40px]">
                  {project.description || 'No description provided.'}
                </p>
                <div className="space-y-1.5">`,
  `                        {project.dueDate && (
                          <span className="flex items-center gap-1">
                            <Clock size={12}/> 
                            {new Date(project.dueDate).toLocaleDateString()}
                            {(() => {
                              const daysLeft = Math.ceil((new Date(project.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                              return (
                                <span className={\`ml-1 \${daysLeft < 0 ? 'text-red-500' : daysLeft <= 3 ? 'text-orange-500' : ''}\`}>
                                  ({daysLeft < 0 ? 'Telat ' + Math.abs(daysLeft) : daysLeft} hari)
                                </span>
                              );
                            })()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 min-h-[40px]">
                  {project.description || 'No description provided.'}
                </p>

                {(project.totalEstimatedHours || project.estimatedHoursPerDay) && (
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700/50">
                    {project.estimatedHoursPerDay && (
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-blue-500" />
                        <span>Alokasi: <b>{project.estimatedHoursPerDay} jam</b>/hari</span>
                      </div>
                    )}
                    {project.totalEstimatedHours && (
                      <div className="flex items-center gap-1">
                        <Target size={12} className="text-purple-500" />
                        <span>Total: <b>{project.totalEstimatedHours} jam</b></span>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-1.5">`
);
fs.writeFileSync('src/components/ProjectDashboard.tsx', code);
