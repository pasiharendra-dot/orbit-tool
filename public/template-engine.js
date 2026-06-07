const TemplateEngine = {
    
    // 1. ORIGINAL: SENTINEL
    sentinel: function(profile, expFormatted) {
        return `
        <div style="font-family: Calibri, sans-serif;">
            <div class="text-center border-b pb-3 border-blue-200">
                <h1 class="text-xl md:text-2xl font-bold text-[#0F3B68] tracking-tight">${profile.name}</h1>
                <p class="text-[11px] md:text-xs font-bold text-gray-600 uppercase mt-1 tracking-wide leading-relaxed">${profile.title}</p>
                <p class="text-[9px] md:text-[10px] text-gray-500 mt-1">${profile.contact}</p>
                ${profile.portfolio_links && profile.portfolio_links.length > 0 ? `<p class="text-[9px] md:text-[10px] text-blue-600 mt-0.5 font-medium">${profile.portfolio_links.join('  |  ')}</p>` : ''}
            </div>
            <div>
                <h2 class="text-[11px] md:text-xs font-bold text-[#0F3B68] border-b border-gray-200 pb-0.5 uppercase tracking-wider mt-2">Professional Summary</h2>
                <p class="text-gray-600 mt-1.5 leading-relaxed text-justify">${profile.summary}</p>
            </div>
            ${profile.skills && profile.skills.length > 0 ? `<div><h2 class="text-[11px] md:text-xs font-bold text-[#0F3B68] border-b border-gray-200 pb-0.5 uppercase tracking-wider mt-3">Core Competencies</h2><p class="text-gray-600 mt-1.5 leading-relaxed">${profile.skills.join('  |  ')}</p></div>` : ''}
            ${profile.achievements && profile.achievements.length > 0 ? `<div><h2 class="text-[11px] md:text-xs font-bold text-[#0F3B68] border-b border-gray-200 pb-0.5 uppercase tracking-wider mt-3">Achievements & Awards</h2><ul class="list-disc pl-4 mt-1.5 space-y-1 text-gray-600">${profile.achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
            ${profile.technical_skills && profile.technical_skills.length > 0 ? `<div><h2 class="text-[11px] md:text-xs font-bold text-[#0F3B68] border-b border-gray-200 pb-0.5 uppercase tracking-wider mt-3">Technical Profile</h2><div class="mt-1.5 space-y-1 text-gray-600 text-[10px] md:text-xs">${profile.technical_skills.map(t => `<div class="flex"><span class="font-bold w-1/4 uppercase">${t.category}:</span><span class="w-3/4">${t.skills.join(', ')}</span></div>`).join('')}</div></div>` : ''}
            ${profile.clinical_rotations && profile.clinical_rotations.length > 0 ? `<div><h2 class="text-[11px] md:text-xs font-bold text-[#0F3B68] border-b border-gray-200 pb-0.5 uppercase tracking-wider mt-3">Clinical Rotations & Experience</h2><ul class="list-disc pl-4 mt-1.5 space-y-1 text-gray-600">${profile.clinical_rotations.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
            <div>
                <h2 class="text-[11px] md:text-xs font-bold text-[#0F3B68] border-b border-gray-200 pb-0.5 uppercase tracking-wider mt-3">Work Experience</h2>
                <div class="text-gray-600">${expFormatted}</div>
            </div>
            ${profile.internships && profile.internships.length > 0 ? `<div><h2 class="text-[11px] md:text-xs font-bold text-[#0F3B68] border-b border-gray-200 pb-0.5 uppercase tracking-wider mt-3">Internships</h2><div class="text-gray-600 mt-1 whitespace-pre-line leading-relaxed">${profile.internships.join('\n\n')}</div></div>` : ''}
            ${profile.projects && profile.projects.length > 0 ? `<div><h2 class="text-[11px] md:text-xs font-bold text-[#0F3B68] border-b border-gray-200 pb-0.5 uppercase tracking-wider mt-3">Projects</h2><div class="text-gray-600 mt-1 whitespace-pre-line leading-relaxed">${profile.projects.join('\n\n')}</div></div>` : ''}
            ${profile.volunteer && profile.volunteer.length > 0 ? `<div><h2 class="text-[11px] md:text-xs font-bold text-[#0F3B68] border-b border-gray-200 pb-0.5 uppercase tracking-wider mt-3">Volunteer Work</h2><div class="text-gray-600 mt-1 whitespace-pre-line leading-relaxed">${profile.volunteer.join('\n\n')}</div></div>` : ''}
            ${profile.extracurriculars && profile.extracurriculars.length > 0 ? `<div><h2 class="text-[11px] md:text-xs font-bold text-[#0F3B68] border-b border-gray-200 pb-0.5 uppercase tracking-wider mt-3">Extracurriculars</h2><div class="text-gray-600 mt-1 whitespace-pre-line leading-relaxed">${profile.extracurriculars.join('\n\n')}</div></div>` : ''}
            ${profile.education ? `<div><h2 class="text-[11px] md:text-xs font-bold text-[#0F3B68] border-b border-gray-200 pb-0.5 uppercase tracking-wider mt-3">Education</h2><p class="text-gray-600 mt-1.5 whitespace-pre-line">${profile.education}</p></div>` : ''}
            ${profile.bar_admissions && profile.bar_admissions.length > 0 ? `<div><h2 class="text-[11px] md:text-xs font-bold text-[#0F3B68] border-b border-gray-200 pb-0.5 uppercase tracking-wider mt-3">Bar Admissions</h2><ul class="list-disc pl-4 mt-1.5 space-y-1 text-gray-600">${profile.bar_admissions.map(b => `<li>${b}</li>`).join('')}</ul></div>` : ''}
            ${profile.publications && profile.publications.length > 0 ? `<div><h2 class="text-[11px] md:text-xs font-bold text-[#0F3B68] border-b border-gray-200 pb-0.5 uppercase tracking-wider mt-3">Publications & Presentations</h2><ul class="list-disc pl-4 mt-1.5 space-y-1 text-gray-600">${profile.publications.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
            ${profile.certifications && profile.certifications.length > 0 ? `<div><h2 class="text-[11px] md:text-xs font-bold text-[#0F3B68] border-b border-gray-200 pb-0.5 uppercase tracking-wider mt-3">Certifications</h2><ul class="list-disc pl-4 mt-1.5 space-y-1 text-gray-600">${profile.certifications.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
            ${profile.personal_details && profile.personal_details.length > 0 ? `<div><h2 class="text-[11px] md:text-xs font-bold text-[#0F3B68] border-b border-gray-200 pb-0.5 uppercase tracking-wider mt-3">Personal Details</h2><ul class="mt-1.5 space-y-1 text-gray-600">${profile.personal_details.map(p => `<li><strong>${p.label}:</strong> ${p.value}</li>`).join('')}</ul></div>` : ''}
        </div>
        `;
    },

// 2. ORIGINAL: VANGUARD
    vanguard: function(profile, expFormatted) {
        return `
            <div class="grid grid-cols-1 md:grid-cols-12 bg-white" style="font-family: Calibri, sans-serif; gap: 0;">
                <div class="md:col-span-4 bg-[#0F3B68] text-white pt-8 px-6 pb-6 space-y-5 min-h-[80vh]">
                    ${profile.photo 
                        ? `<div class="flex justify-center mb-6"><img src="${profile.photo}" class="w-full max-w-[200px] aspect-square object-cover border-[3px] border-white shadow-md" alt="Profile Photo"></div>` 
                        : `<div class="text-center text-[10px] text-blue-300 border border-blue-800 py-16 rounded mb-6 flex items-center justify-center aspect-square w-full max-w-[200px] mx-auto">Photo Placeholder</div>`
                    }
                    <div><h3 class="font-bold border-b border-white pb-1 text-sm tracking-wider mb-2">CONTACT</h3><p class="text-[11px] space-y-1.5 opacity-95 leading-relaxed">${profile.contact.replace(/ \| /g, '<br>')}</p></div>
                    ${profile.portfolio_links && profile.portfolio_links.length > 0 ? `<div><h3 class="font-bold border-b border-white pb-1 text-sm tracking-wider mb-2">PORTFOLIO</h3><ul class="text-[11px] space-y-1 text-blue-100">${profile.portfolio_links.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
                    ${profile.skills && profile.skills.length > 0 ? `<div><h3 class="font-bold border-b border-white pb-1 text-sm tracking-wider mb-2">SKILLS</h3><ul class="text-[11px] space-y-1 opacity-95">${profile.skills.map(s => `<li>• ${s}</li>`).join('')}</ul></div>` : ''}
                    ${profile.education ? `<div><h3 class="font-bold border-b border-white pb-1 text-sm tracking-wider mb-2">EDUCATION</h3><p class="text-[11px] opacity-95 whitespace-pre-line">${profile.education}</p></div>` : ''}
                    ${profile.bar_admissions && profile.bar_admissions.length > 0 ? `<div><h3 class="font-bold border-b border-white pb-1 text-sm tracking-wider mb-2">BAR ADMISSIONS</h3><ul class="text-[11px] space-y-1 opacity-95">${profile.bar_admissions.map(b => `<li>• ${b}</li>`).join('')}</ul></div>` : ''}
                    ${profile.publications && profile.publications.length > 0 ? `<div><h3 class="font-bold border-b border-white pb-1 text-sm tracking-wider mb-2">PUBLICATIONS</h3><ul class="text-[11px] space-y-1 opacity-95">${profile.publications.map(p => `<li>• ${p}</li>`).join('')}</ul></div>` : ''}
                    ${profile.certifications && profile.certifications.length > 0 ? `<div><h3 class="font-bold border-b border-white pb-1 text-sm tracking-wider mb-2">CERTIFICATIONS</h3><ul class="text-[11px] space-y-1 opacity-95">${profile.certifications.map(c => `<li>• ${c}</li>`).join('')}</ul></div>` : ''}
                    ${profile.personal_details && profile.personal_details.length > 0 ? `<div><h3 class="font-bold border-b border-white pb-1 text-sm tracking-wider mb-2">PERSONAL DETAILS</h3><ul class="text-[11px] space-y-1 opacity-95">${profile.personal_details.map(p => `<li><strong>${p.label}:</strong> ${p.value}</li>`).join('')}</ul></div>` : ''}
                </div>
                <div class="md:col-span-8 px-8 py-6 space-y-4">
                    <div>
                        <h1 class="text-3xl md:text-4xl font-bold text-[#0F3B68] uppercase tracking-wide">${profile.name}</h1>
                        <p class="text-sm font-bold text-[#D4AF37] mt-1.5 uppercase leading-relaxed">${profile.title}</p>
                    </div>
                    <div><h3 class="font-bold text-[#0F3B68] border-b border-gray-300 pb-0.5 uppercase text-xs">Professional Summary</h3><p class="text-gray-800 mt-2 text-xs leading-relaxed text-justify">${profile.summary}</p></div>
                    ${profile.achievements && profile.achievements.length > 0 ? `<div><h3 class="font-bold text-[#0F3B68] border-b border-gray-300 pb-0.5 uppercase text-xs mt-3">Achievements</h3><ul class="list-disc pl-5 mt-2 text-gray-800 space-y-1 text-xs">${profile.achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
                    ${profile.technical_skills && profile.technical_skills.length > 0 ? `<div><h3 class="font-bold text-[#0F3B68] border-b border-gray-300 pb-0.5 uppercase text-xs mt-3">Technical Profile</h3><div class="mt-2 text-gray-800 space-y-1 text-xs">${profile.technical_skills.map(t => `<div class="flex"><span class="font-bold w-1/4 uppercase">${t.category}:</span><span class="w-3/4">${t.skills.join(', ')}</span></div>`).join('')}</div></div>` : ''}
                    ${profile.clinical_rotations && profile.clinical_rotations.length > 0 ? `<div><h3 class="font-bold text-[#0F3B68] border-b border-gray-300 pb-0.5 uppercase text-xs mt-3">Clinical Rotations</h3><ul class="list-disc pl-5 mt-2 text-gray-800 space-y-1 text-xs">${profile.clinical_rotations.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                    <div><h3 class="font-bold text-[#0F3B68] border-b border-gray-300 pb-0.5 uppercase text-xs mt-3">Experience</h3><div class="text-gray-800 mt-2 text-xs">${expFormatted}</div></div>
                    ${profile.internships && profile.internships.length > 0 ? `<div><h3 class="font-bold text-[#0F3B68] border-b border-gray-300 pb-0.5 uppercase text-xs mt-3">Internships</h3><div class="text-gray-800 mt-2 whitespace-pre-line text-xs leading-relaxed">${profile.internships.join('\n\n')}</div></div>` : ''}
                    ${profile.projects && profile.projects.length > 0 ? `<div><h3 class="font-bold text-[#0F3B68] border-b border-gray-300 pb-0.5 uppercase text-xs mt-3">Projects</h3><div class="text-gray-800 mt-2 whitespace-pre-line text-xs leading-relaxed">${profile.projects.join('\n\n')}</div></div>` : ''}
                    ${profile.volunteer && profile.volunteer.length > 0 ? `<div><h3 class="font-bold text-[#0F3B68] border-b border-gray-300 pb-0.5 uppercase text-xs mt-3">Volunteer Work</h3><div class="text-gray-800 mt-2 whitespace-pre-line text-xs leading-relaxed">${profile.volunteer.join('\n\n')}</div></div>` : ''}
                    ${profile.extracurriculars && profile.extracurriculars.length > 0 ? `<div><h3 class="font-bold text-[#0F3B68] border-b border-gray-300 pb-0.5 uppercase text-xs mt-3">Extracurriculars</h3><div class="text-gray-800 mt-2 whitespace-pre-line text-xs leading-relaxed">${profile.extracurriculars.join('\n\n')}</div></div>` : ''}
                </div>
            </div>
        `;
    },

    // 3. ORIGINAL: CREATIVE
    creative: function(profile, expFormatted) {
        return `
        <div style="font-family: Arial, sans-serif;">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 border-b-2 border-[#1F4E79] pb-3 mb-3">
                <div class="md:col-span-7"><h1 class="text-xl md:text-2xl font-bold text-[#1F4E79]">${profile.name}</h1><p class="text-[11px] md:text-xs font-bold text-gray-700 mt-1 uppercase leading-relaxed">${profile.title}</p></div>
                <div class="md:col-span-5 md:border-l md:border-[#1F4E79] md:pl-3 text-[10px] text-gray-600 leading-relaxed"><p>${profile.contact.replace(/ \| /g, '<br>')}</p>${profile.portfolio_links && profile.portfolio_links.length > 0 ? `<div class="mt-1 font-medium text-[#1F4E79]">${profile.portfolio_links.join('<br>')}</div>` : ''}</div>
            </div>
            <div class="space-y-4">
                <div><h2 class="text-[11px] font-bold text-[#1F4E79] tracking-wide uppercase">Professional Summary</h2><p class="text-gray-600 mt-1 leading-relaxed text-justify">${profile.summary}</p></div>
                <div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4 border-t border-gray-200 pt-3">
                    <div class="md:col-span-4 space-y-3">
                        ${profile.skills && profile.skills.length > 0 ? `<div><h3 class="font-bold text-[#1F4E79] border-b pb-0.5 mb-1 text-[10px]">SKILLS</h3><ul class="space-y-1 text-gray-600 text-[10px]">${profile.skills.map(s => `<li>• ${s}</li>`).join('')}</ul></div>` : ''}
                        ${profile.education ? `<div><h3 class="font-bold text-[#1F4E79] border-b pb-0.5 mb-1 text-[10px]">EDUCATION</h3><p class="text-[10px] text-gray-600 whitespace-pre-line">${profile.education}</p></div>` : ''}
                        ${profile.bar_admissions && profile.bar_admissions.length > 0 ? `<div><h3 class="font-bold text-[#1F4E79] border-b pb-0.5 mb-1 text-[10px]">BAR ADMISSIONS</h3><ul class="space-y-1 text-gray-600 text-[10px]">${profile.bar_admissions.map(b => `<li>• ${b}</li>`).join('')}</ul></div>` : ''}
                        ${profile.publications && profile.publications.length > 0 ? `<div><h3 class="font-bold text-[#1F4E79] border-b pb-0.5 mb-1 text-[10px]">PUBLICATIONS</h3><ul class="space-y-1 text-gray-600 text-[10px]">${profile.publications.map(p => `<li>• ${p}</li>`).join('')}</ul></div>` : ''}
                        ${profile.certifications && profile.certifications.length > 0 ? `<div><h3 class="font-bold text-[#1F4E79] border-b pb-0.5 mb-1 text-[10px]">CERTIFICATIONS</h3><ul class="space-y-1 text-gray-600 text-[10px]">${profile.certifications.map(c => `<li>• ${c}</li>`).join('')}</ul></div>` : ''}
                        ${profile.personal_details && profile.personal_details.length > 0 ? `<div><h3 class="font-bold text-[#1F4E79] border-b pb-0.5 mb-1 text-[10px]">PERSONAL DETAILS</h3><ul class="space-y-1 text-gray-600 text-[10px]">${profile.personal_details.map(p => `<li><strong>${p.label}:</strong> ${p.value}</li>`).join('')}</ul></div>` : ''}
                    </div>
                    <div class="md:col-span-8 space-y-3">
                        ${profile.achievements && profile.achievements.length > 0 ? `<div><h3 class="font-bold text-[#1F4E79] border-b pb-0.5 mb-1 text-[10px]">ACHIEVEMENTS</h3><ul class="list-disc pl-4 text-gray-600 text-[10px] space-y-1 mb-3">${profile.achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
                        ${profile.technical_skills && profile.technical_skills.length > 0 ? `<div><h3 class="font-bold text-[#1F4E79] border-b pb-0.5 mb-1 text-[10px]">TECHNICAL PROFILE</h3><div class="text-gray-600 text-[10px] space-y-1 mb-3">${profile.technical_skills.map(t => `<div class="flex"><span class="font-bold w-1/4">${t.category}:</span><span class="w-3/4">${t.skills.join(', ')}</span></div>`).join('')}</div></div>` : ''}
                        ${profile.clinical_rotations && profile.clinical_rotations.length > 0 ? `<div><h3 class="font-bold text-[#1F4E79] border-b pb-0.5 mb-1 text-[10px]">CLINICAL ROTATIONS</h3><ul class="list-disc pl-4 text-gray-600 text-[10px] space-y-1 mb-3">${profile.clinical_rotations.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                        <div><h3 class="font-bold text-[#1F4E79] border-b pb-0.5 mb-1 text-[10px]">EXPERIENCE</h3><div class="text-gray-600">${expFormatted}</div></div>
                        ${profile.internships && profile.internships.length > 0 ? `<div><h3 class="font-bold text-[#1F4E79] border-b pb-0.5 mb-1 text-[10px] mt-3">INTERNSHIPS</h3><div class="text-gray-600 mt-1 whitespace-pre-line leading-relaxed">${profile.internships.join('\n\n')}</div></div>` : ''}
                        ${profile.projects && profile.projects.length > 0 ? `<div><h3 class="font-bold text-[#1F4E79] border-b pb-0.5 mb-1 text-[10px] mt-3">PROJECTS</h3><div class="text-gray-600 mt-1 whitespace-pre-line leading-relaxed">${profile.projects.join('\n\n')}</div></div>` : ''}
                        ${profile.volunteer && profile.volunteer.length > 0 ? `<div><h3 class="font-bold text-[#1F4E79] border-b pb-0.5 mb-1 text-[10px] mt-3">VOLUNTEER WORK</h3><div class="text-gray-600 mt-1 whitespace-pre-line leading-relaxed">${profile.volunteer.join('\n\n')}</div></div>` : ''}
                        ${profile.extracurriculars && profile.extracurriculars.length > 0 ? `<div><h3 class="font-bold text-[#1F4E79] border-b pb-0.5 mb-1 text-[10px] mt-3">EXTRACURRICULARS</h3><div class="text-gray-600 mt-1 whitespace-pre-line leading-relaxed">${profile.extracurriculars.join('\n\n')}</div></div>` : ''}
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    // 4. ORIGINAL: GLOBAL
    global: function(profile, expFormatted) {
        return `
        <div style="font-family: Calibri, sans-serif;">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 border-b-2 border-green-800 pb-3 mb-2">
                <div class="md:col-span-7"><h1 class="text-xl md:text-2xl font-bold text-green-800">${profile.name}</h1><p class="text-[11px] font-semibold text-gray-700 uppercase mt-1 leading-relaxed">${profile.title}</p></div>
                <div class="md:col-span-5 md:text-right text-[10px] text-gray-500 leading-relaxed"><p>${profile.contact.replace(/ \| /g, '<br>')}</p>${profile.portfolio_links && profile.portfolio_links.length > 0 ? `<div class="mt-1 font-medium text-green-700">${profile.portfolio_links.join('<br>')}</div>` : ''}</div>
            </div>
            <div class="space-y-4">
                <div class="flex items-center space-x-2 my-2"><div class="flex-grow border-b border-green-700"></div><span class="text-[10px] font-bold text-green-800 uppercase tracking-wider">Professional Profile</span><div class="flex-grow border-b border-green-700"></div></div>
                <p class="text-gray-600 leading-relaxed text-justify">${profile.summary}</p>
                ${profile.skills && profile.skills.length > 0 ? `
                <div class="flex items-center space-x-2 my-2"><div class="flex-grow border-b border-green-700"></div><span class="text-[10px] font-bold text-green-800 uppercase tracking-wider">Competencies</span><div class="flex-grow border-b border-green-700"></div></div>
                <p class="text-gray-600 leading-relaxed text-center">${profile.skills.join('   •   ')}</p>
                ` : ''}
                ${profile.achievements && profile.achievements.length > 0 ? `<div class="flex items-center space-x-2 my-2 mt-4"><div class="flex-grow border-b border-green-700"></div><span class="text-[10px] font-bold text-green-800 uppercase tracking-wider">Achievements</span><div class="flex-grow border-b border-green-700"></div></div><ul class="list-disc pl-4 text-gray-600 space-y-1">${profile.achievements.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}
                ${profile.technical_skills && profile.technical_skills.length > 0 ? `
                <div class="flex items-center space-x-2 my-2 mt-4"><div class="flex-grow border-b border-green-700"></div><span class="text-[10px] font-bold text-green-800 uppercase tracking-wider">Technical Profile</span><div class="flex-grow border-b border-green-700"></div></div>
                <div class="text-gray-600 space-y-1 text-xs px-4">${profile.technical_skills.map(t => `<div class="flex"><span class="font-bold w-1/4 uppercase">${t.category}:</span><span class="w-3/4">${t.skills.join(', ')}</span></div>`).join('')}</div>
                ` : ''}
                ${profile.clinical_rotations && profile.clinical_rotations.length > 0 ? `
                <div class="flex items-center space-x-2 my-2 mt-4"><div class="flex-grow border-b border-green-700"></div><span class="text-[10px] font-bold text-green-800 uppercase tracking-wider">Clinical Rotations</span><div class="flex-grow border-b border-green-700"></div></div>
                <ul class="list-disc pl-4 text-gray-600 space-y-1">${profile.clinical_rotations.map(c => `<li>${c}</li>`).join('')}</ul>
                ` : ''}
                <div class="flex items-center space-x-2 my-2 mt-4"><div class="flex-grow border-b border-green-700"></div><span class="text-[10px] font-bold text-green-800 uppercase tracking-wider">Career Summary</span><div class="flex-grow border-b border-green-700"></div></div>
                <div class="text-gray-600">${expFormatted}</div>
                ${profile.internships && profile.internships.length > 0 ? `<div class="flex items-center space-x-2 my-2 mt-4"><div class="flex-grow border-b border-green-700"></div><span class="text-[10px] font-bold text-green-800 uppercase tracking-wider">Internships</span><div class="flex-grow border-b border-green-700"></div></div><div class="text-gray-600 whitespace-pre-line leading-relaxed">${profile.internships.join('\n\n')}</div>` : ''}
                ${profile.projects && profile.projects.length > 0 ? `<div class="flex items-center space-x-2 my-2 mt-4"><div class="flex-grow border-b border-green-700"></div><span class="text-[10px] font-bold text-green-800 uppercase tracking-wider">Projects</span><div class="flex-grow border-b border-green-700"></div></div><div class="text-gray-600 whitespace-pre-line leading-relaxed">${profile.projects.join('\n\n')}</div>` : ''}
                ${profile.volunteer && profile.volunteer.length > 0 ? `<div class="flex items-center space-x-2 my-2 mt-4"><div class="flex-grow border-b border-green-700"></div><span class="text-[10px] font-bold text-green-800 uppercase tracking-wider">Volunteer Work</span><div class="flex-grow border-b border-green-700"></div></div><div class="text-gray-600 whitespace-pre-line leading-relaxed">${profile.volunteer.join('\n\n')}</div>` : ''}
                ${profile.extracurriculars && profile.extracurriculars.length > 0 ? `<div class="flex items-center space-x-2 my-2 mt-4"><div class="flex-grow border-b border-green-700"></div><span class="text-[10px] font-bold text-green-800 uppercase tracking-wider">Extracurriculars</span><div class="flex-grow border-b border-green-700"></div></div><div class="text-gray-600 whitespace-pre-line leading-relaxed">${profile.extracurriculars.join('\n\n')}</div>` : ''}
                ${profile.education ? `
                <div class="flex items-center space-x-2 my-2 mt-4"><div class="flex-grow border-b border-green-700"></div><span class="text-[10px] font-bold text-green-800 uppercase tracking-wider">Education</span><div class="flex-grow border-b border-green-700"></div></div>
                <p class="text-gray-600 text-center whitespace-pre-line">${profile.education}</p>
                ` : ''}
                ${profile.bar_admissions && profile.bar_admissions.length > 0 ? `
                <div class="flex items-center space-x-2 my-2 mt-4"><div class="flex-grow border-b border-green-700"></div><span class="text-[10px] font-bold text-green-800 uppercase tracking-wider">Bar Admissions</span><div class="flex-grow border-b border-green-700"></div></div>
                <ul class="text-gray-600 text-center space-y-1">${profile.bar_admissions.map(b => `<li>${b}</li>`).join('')}</ul>
                ` : ''}
                ${profile.publications && profile.publications.length > 0 ? `
                <div class="flex items-center space-x-2 my-2 mt-4"><div class="flex-grow border-b border-green-700"></div><span class="text-[10px] font-bold text-green-800 uppercase tracking-wider">Publications</span><div class="flex-grow border-b border-green-700"></div></div>
                <ul class="text-gray-600 text-center space-y-1">${profile.publications.map(p => `<li>${p}</li>`).join('')}</ul>
                ` : ''}
                ${profile.certifications && profile.certifications.length > 0 ? `
                <div class="flex items-center space-x-2 my-2 mt-4"><div class="flex-grow border-b border-green-700"></div><span class="text-[10px] font-bold text-green-800 uppercase tracking-wider">Certifications</span><div class="flex-grow border-b border-green-700"></div></div>
                <ul class="text-gray-600 text-center space-y-1">${profile.certifications.map(c => `<li>${c}</li>`).join('')}</ul>
                ` : ''}
                ${profile.personal_details && profile.personal_details.length > 0 ? `
                <div class="flex items-center space-x-2 my-2 mt-4"><div class="flex-grow border-b border-green-700"></div><span class="text-[10px] font-bold text-green-800 uppercase tracking-wider">Personal Details</span><div class="flex-grow border-b border-green-700"></div></div>
                <ul class="text-gray-600 text-center space-y-1">${profile.personal_details.map(p => `<li><strong>${p.label}:</strong> ${p.value}</li>`).join('')}</ul>
                ` : ''}
            </div>
        </div>
        `;
    },

    // 5. NEW: APEX
    apex: function(profile, expFormatted) {
        return `
        <div style="font-family: Arial, sans-serif;">
            <div class="mb-4">
                <h1 class="text-2xl md:text-3xl font-extrabold text-black tracking-tight mb-1">${profile.name}</h1>
                <p class="text-xs font-semibold text-gray-800 leading-relaxed">${profile.title}</p>
                <p class="text-[10px] text-gray-600 mt-0.5">${profile.contact.replace(/ \| /g, ' • ')}</p>
                ${profile.portfolio_links && profile.portfolio_links.length > 0 ? `<p class="text-[10px] text-blue-600 mt-0.5">${profile.portfolio_links.join(' • ')}</p>` : ''}
            </div>
            <div class="space-y-3">
                <div><h2 class="text-[10px] font-bold bg-gray-100 text-black px-2 py-1 uppercase tracking-[0.2em] mb-2">Summary</h2><p class="text-xs text-gray-800 leading-relaxed">${profile.summary}</p></div>
                ${profile.achievements && profile.achievements.length > 0 ? `<div><h2 class="text-[10px] font-bold bg-gray-100 text-black px-2 py-1 uppercase tracking-[0.2em] mb-2">Achievements</h2><ul class="list-disc list-inside text-xs text-gray-800 space-y-1">${profile.achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
                ${profile.technical_skills && profile.technical_skills.length > 0 ? `<div><h2 class="text-[10px] font-bold bg-gray-100 text-black px-2 py-1 uppercase tracking-[0.2em] mb-2">Technical Profile</h2><div class="text-xs text-gray-800 space-y-1">${profile.technical_skills.map(t => `<div class="flex"><span class="font-bold w-1/4 uppercase">${t.category}:</span><span class="w-3/4">${t.skills.join(', ')}</span></div>`).join('')}</div></div>` : ''}
                ${profile.clinical_rotations && profile.clinical_rotations.length > 0 ? `<div><h2 class="text-[10px] font-bold bg-gray-100 text-black px-2 py-1 uppercase tracking-[0.2em] mb-2">Clinical Rotations</h2><ul class="list-disc list-inside text-xs text-gray-800 space-y-1">${profile.clinical_rotations.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                <div><h2 class="text-[10px] font-bold bg-gray-100 text-black px-2 py-1 uppercase tracking-[0.2em] mb-2">Experience</h2><div class="text-xs text-gray-800">${expFormatted}</div></div>
                ${profile.internships && profile.internships.length > 0 ? `<div><h2 class="text-[10px] font-bold bg-gray-100 text-black px-2 py-1 uppercase tracking-[0.2em] mb-2">Internships</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.internships.join('\n\n')}</div></div>` : ''}
                ${profile.projects && profile.projects.length > 0 ? `<div><h2 class="text-[10px] font-bold bg-gray-100 text-black px-2 py-1 uppercase tracking-[0.2em] mb-2">Projects</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.projects.join('\n\n')}</div></div>` : ''}
                ${profile.volunteer && profile.volunteer.length > 0 ? `<div><h2 class="text-[10px] font-bold bg-gray-100 text-black px-2 py-1 uppercase tracking-[0.2em] mb-2">Volunteer Work</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.volunteer.join('\n\n')}</div></div>` : ''}
                ${profile.extracurriculars && profile.extracurriculars.length > 0 ? `<div><h2 class="text-[10px] font-bold bg-gray-100 text-black px-2 py-1 uppercase tracking-[0.2em] mb-2">Extracurriculars</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.extracurriculars.join('\n\n')}</div></div>` : ''}
                ${profile.education ? `<div><h2 class="text-[10px] font-bold bg-gray-100 text-black px-2 py-1 uppercase tracking-[0.2em] mb-2">Education</h2><p class="text-xs text-gray-800 whitespace-pre-line">${profile.education}</p></div>` : ''}
                ${profile.bar_admissions && profile.bar_admissions.length > 0 ? `<div><h2 class="text-[10px] font-bold bg-gray-100 text-black px-2 py-1 uppercase tracking-[0.2em] mb-2">Bar Admissions</h2><ul class="list-disc list-inside text-xs text-gray-800 space-y-1">${profile.bar_admissions.map(b => `<li>${b}</li>`).join('')}</ul></div>` : ''}
                ${profile.publications && profile.publications.length > 0 ? `<div><h2 class="text-[10px] font-bold bg-gray-100 text-black px-2 py-1 uppercase tracking-[0.2em] mb-2">Publications</h2><ul class="list-disc list-inside text-xs text-gray-800 space-y-1">${profile.publications.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
                ${profile.skills && profile.skills.length > 0 ? `<div><h2 class="text-[10px] font-bold bg-gray-100 text-black px-2 py-1 uppercase tracking-[0.2em] mb-2">Skills & Tools</h2><p class="text-xs text-gray-800 leading-relaxed">${profile.skills.join(', ')}</p></div>` : ''}
                ${profile.certifications && profile.certifications.length > 0 ? `<div><h2 class="text-[10px] font-bold bg-gray-100 text-black px-2 py-1 uppercase tracking-[0.2em] mb-2">Certifications</h2><ul class="list-disc list-inside text-xs text-gray-800 space-y-1">${profile.certifications.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                ${profile.personal_details && profile.personal_details.length > 0 ? `<div><h2 class="text-[10px] font-bold bg-gray-100 text-black px-2 py-1 uppercase tracking-[0.2em] mb-2">Personal Details</h2><ul class="text-xs text-gray-800 space-y-1">${profile.personal_details.map(p => `<li><strong>${p.label}:</strong> ${p.value}</li>`).join('')}</ul></div>` : ''}
            </div>
        </div>
        `;
    },

    // 6. NEW: AXIOM
    axiom: function(profile, expFormatted) {
        return `
        <div style="font-family: Arial, sans-serif;">
            <div class="border-b-2 border-black pb-2 mb-3">
                <h1 class="text-2xl md:text-3xl font-black text-black tracking-tighter">${profile.name}</h1>
                <p class="text-xs font-semibold text-gray-800 mt-1 leading-relaxed">${profile.title}</p>
            </div>
            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-4 space-y-4">
                    <div><h3 class="text-[9px] font-bold tracking-[0.15em] border-b border-gray-300 pb-1 mb-2 uppercase">Contact</h3><p class="text-[10px] text-gray-700 leading-relaxed">${profile.contact.replace(/ \| /g, '<br>')}</p>${profile.portfolio_links && profile.portfolio_links.length > 0 ? `<p class="text-[10px] text-blue-700 mt-1">${profile.portfolio_links.join('<br>')}</p>` : ''}</div>
                    ${profile.skills && profile.skills.length > 0 ? `<div><h3 class="text-[9px] font-bold tracking-[0.15em] border-b border-gray-300 pb-1 mb-2 uppercase">Core Skills</h3><ul class="text-[10px] text-gray-700 space-y-0.5">${profile.skills.slice(0,8).map(s => `<li>${s}</li>`).join('')}</ul></div>` : ''}
                    ${profile.education ? `<div><h3 class="text-[9px] font-bold tracking-[0.15em] border-b border-gray-300 pb-1 mb-2 uppercase">Education</h3><p class="text-[10px] text-gray-700 whitespace-pre-line">${profile.education}</p></div>` : ''}
                    ${profile.bar_admissions && profile.bar_admissions.length > 0 ? `<div><h3 class="text-[9px] font-bold tracking-[0.15em] border-b border-gray-300 pb-1 mb-2 uppercase">Bar Admissions</h3><ul class="text-[10px] text-gray-700 space-y-0.5">${profile.bar_admissions.map(b => `<li>${b}</li>`).join('')}</ul></div>` : ''}
                    ${profile.publications && profile.publications.length > 0 ? `<div><h3 class="text-[9px] font-bold tracking-[0.15em] border-b border-gray-300 pb-1 mb-2 uppercase">Publications</h3><ul class="text-[10px] text-gray-700 space-y-0.5">${profile.publications.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
                    ${profile.certifications && profile.certifications.length > 0 ? `<div><h3 class="text-[9px] font-bold tracking-[0.15em] border-b border-gray-300 pb-1 mb-2 uppercase">Certifications</h3><ul class="text-[10px] text-gray-700 space-y-0.5">${profile.certifications.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                    ${profile.personal_details && profile.personal_details.length > 0 ? `<div><h3 class="text-[9px] font-bold tracking-[0.15em] border-b border-gray-300 pb-1 mb-2 uppercase">Personal Details</h3><ul class="text-[10px] text-gray-700 space-y-0.5">${profile.personal_details.map(p => `<li><strong>${p.label}:</strong> ${p.value}</li>`).join('')}</ul></div>` : ''}
                </div>
                <div class="col-span-8 space-y-4 border-l border-gray-200 pl-4">
                    <div><h3 class="text-[9px] font-bold tracking-[0.15em] mb-1.5 uppercase">Profile</h3><p class="text-xs text-gray-800 leading-relaxed">${profile.summary}</p></div>
                    ${profile.achievements && profile.achievements.length > 0 ? `<div><h3 class="text-[9px] font-bold tracking-[0.15em] mb-1.5 uppercase mt-3">Achievements</h3><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
                    ${profile.technical_skills && profile.technical_skills.length > 0 ? `<div><h3 class="text-[9px] font-bold tracking-[0.15em] mb-1.5 uppercase mt-3">Technical Profile</h3><div class="text-xs text-gray-800 space-y-1">${profile.technical_skills.map(t => `<div class="flex"><span class="font-bold w-1/4 uppercase">${t.category}:</span><span class="w-3/4">${t.skills.join(', ')}</span></div>`).join('')}</div></div>` : ''}
                    ${profile.clinical_rotations && profile.clinical_rotations.length > 0 ? `<div><h3 class="text-[9px] font-bold tracking-[0.15em] mb-1.5 uppercase mt-3">Clinical Rotations</h3><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.clinical_rotations.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                    <div><h3 class="text-[9px] font-bold tracking-[0.15em] mb-1.5 uppercase mt-3">Experience</h3><div class="text-xs text-gray-800">${expFormatted}</div></div>
                    ${profile.internships && profile.internships.length > 0 ? `<div><h3 class="text-[9px] font-bold tracking-[0.15em] mb-1.5 uppercase mt-3">Internships</h3><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.internships.join('\n\n')}</div></div>` : ''}
                    ${profile.projects && profile.projects.length > 0 ? `<div><h3 class="text-[9px] font-bold tracking-[0.15em] mb-1.5 uppercase mt-3">Projects</h3><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.projects.join('\n\n')}</div></div>` : ''}
                    ${profile.volunteer && profile.volunteer.length > 0 ? `<div><h3 class="text-[9px] font-bold tracking-[0.15em] mb-1.5 uppercase mt-3">Volunteer Work</h3><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.volunteer.join('\n\n')}</div></div>` : ''}
                    ${profile.extracurriculars && profile.extracurriculars.length > 0 ? `<div><h3 class="text-[9px] font-bold tracking-[0.15em] mb-1.5 uppercase mt-3">Extracurriculars</h3><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.extracurriculars.join('\n\n')}</div></div>` : ''}
                </div>
            </div>
        </div>
        `;
    },

    // 7. NEW: CHRONICLE
    chronicle: function(profile, expFormatted) {
        return `
        <div style="font-family: Georgia, serif;">
            <div class="border-b-[3px] border-black pb-2 mb-3 font-serif">
                <h1 class="text-2xl md:text-3xl font-bold text-black uppercase tracking-wide">${profile.name}</h1>
                <p class="text-xs font-bold text-gray-800 mt-1.5 leading-relaxed">${profile.title}</p>
                <p class="text-[10px] text-gray-600 mt-0.5">${profile.contact.replace(/ \| /g, ' • ')}</p>
                ${profile.portfolio_links && profile.portfolio_links.length > 0 ? `<p class="text-[10px] text-blue-700 mt-0.5">${profile.portfolio_links.join(' • ')}</p>` : ''}
            </div>
            <div class="space-y-3 font-serif">
                <div><h2 class="text-[10px] font-bold text-black border-b border-gray-300 pb-0.5 mb-1.5 uppercase tracking-widest">Professional Summary</h2><p class="text-xs text-gray-800 leading-relaxed">${profile.summary}</p></div>
                ${profile.achievements && profile.achievements.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black border-b border-gray-300 pb-0.5 mb-1.5 uppercase tracking-widest mt-2">Achievements</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
                ${profile.technical_skills && profile.technical_skills.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black border-b border-gray-300 pb-0.5 mb-1.5 uppercase tracking-widest mt-2">Technical Profile</h2><div class="text-xs text-gray-800 space-y-1">${profile.technical_skills.map(t => `<div class="flex"><span class="font-bold w-1/4 uppercase">${t.category}:</span><span class="w-3/4">${t.skills.join(', ')}</span></div>`).join('')}</div></div>` : ''}
                ${profile.clinical_rotations && profile.clinical_rotations.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black border-b border-gray-300 pb-0.5 mb-1.5 uppercase tracking-widest mt-2">Clinical Rotations</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.clinical_rotations.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                <div><h2 class="text-[10px] font-bold text-black border-b border-gray-300 pb-0.5 mb-1.5 uppercase tracking-widest mt-2">Experience</h2><div class="text-xs text-gray-800">${expFormatted}</div></div>
                ${profile.internships && profile.internships.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black border-b border-gray-300 pb-0.5 mb-1.5 uppercase tracking-widest mt-2">Internships</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.internships.join('\n\n')}</div></div>` : ''}
                ${profile.projects && profile.projects.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black border-b border-gray-300 pb-0.5 mb-1.5 uppercase tracking-widest mt-2">Projects</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.projects.join('\n\n')}</div></div>` : ''}
                ${profile.volunteer && profile.volunteer.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black border-b border-gray-300 pb-0.5 mb-1.5 uppercase tracking-widest mt-2">Volunteer Work</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.volunteer.join('\n\n')}</div></div>` : ''}
                ${profile.extracurriculars && profile.extracurriculars.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black border-b border-gray-300 pb-0.5 mb-1.5 uppercase tracking-widest mt-2">Extracurriculars</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.extracurriculars.join('\n\n')}</div></div>` : ''}
                ${profile.education ? `<div><h2 class="text-[10px] font-bold text-black border-b border-gray-300 pb-0.5 mb-1.5 uppercase tracking-widest mt-2">Education</h2><p class="text-xs text-gray-800 whitespace-pre-line">${profile.education}</p></div>` : ''}
                ${profile.bar_admissions && profile.bar_admissions.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black border-b border-gray-300 pb-0.5 mb-1.5 uppercase tracking-widest mt-2">Bar Admissions</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.bar_admissions.map(b => `<li>${b}</li>`).join('')}</ul></div>` : ''}
                ${profile.publications && profile.publications.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black border-b border-gray-300 pb-0.5 mb-1.5 uppercase tracking-widest mt-2">Publications</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.publications.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
                ${profile.skills && profile.skills.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black border-b border-gray-300 pb-0.5 mb-1.5 uppercase tracking-widest mt-2">Skills</h2><p class="text-xs text-gray-800 leading-relaxed">${profile.skills.join('  •  ')}</p></div>` : ''}
                ${profile.certifications && profile.certifications.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black border-b border-gray-300 pb-0.5 mb-1.5 uppercase tracking-widest mt-2">Certifications</h2><ul class="list-disc list-inside text-xs text-gray-800 space-y-1">${profile.certifications.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                ${profile.personal_details && profile.personal_details.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black border-b border-gray-300 pb-0.5 mb-1.5 uppercase tracking-widest mt-2">Personal Details</h2><ul class="text-xs text-gray-800 space-y-1">${profile.personal_details.map(p => `<li><strong>${p.label}:</strong> ${p.value}</li>`).join('')}</ul></div>` : ''}
            </div>
        </div>
        `;
    },
    
    // 8. NEW: CLASSIC BLUE
    classic_blue: function(profile, expFormatted) {
        return `
        <div style="font-family: Arial, sans-serif;">
            <div class="text-center mb-3">
                <h1 class="text-2xl md:text-3xl font-bold text-[#235789] uppercase tracking-wide mb-1">${profile.name}</h1>
                <p class="text-xs font-bold text-gray-800 mt-1 leading-relaxed">${profile.title}</p>
                <p class="text-[10px] text-gray-600 mt-0.5">${profile.contact.replace(/ \| /g, ' | ')}</p>
                ${profile.portfolio_links && profile.portfolio_links.length > 0 ? `<p class="text-[10px] text-blue-600 mt-0.5">${profile.portfolio_links.join(' | ')}</p>` : ''}
            </div>
            <div class="space-y-3">
                <div><h2 class="text-[11px] font-bold text-[#235789] border-b-2 border-[#87A8D0] pb-0.5 mb-1.5 uppercase">Professional Summary</h2><p class="text-xs text-gray-800 leading-relaxed">${profile.summary}</p></div>
                ${profile.achievements && profile.achievements.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#235789] border-b-2 border-[#87A8D0] pb-0.5 mb-1.5 uppercase mt-2">Achievements</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
                ${profile.technical_skills && profile.technical_skills.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#235789] border-b-2 border-[#87A8D0] pb-0.5 mb-1.5 uppercase mt-2">Technical Profile</h2><div class="text-xs text-gray-800 space-y-1">${profile.technical_skills.map(t => `<div class="flex"><span class="font-bold w-1/4 uppercase">${t.category}:</span><span class="w-3/4">${t.skills.join(', ')}</span></div>`).join('')}</div></div>` : ''}
                ${profile.clinical_rotations && profile.clinical_rotations.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#235789] border-b-2 border-[#87A8D0] pb-0.5 mb-1.5 uppercase mt-2">Clinical Rotations</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.clinical_rotations.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                <div><h2 class="text-[11px] font-bold text-[#235789] border-b-2 border-[#87A8D0] pb-0.5 mb-1.5 uppercase mt-2">Work Experience</h2><div class="text-xs text-gray-800">${expFormatted}</div></div>
                ${profile.internships && profile.internships.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#235789] border-b-2 border-[#87A8D0] pb-0.5 mb-1.5 uppercase mt-2">Internships</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.internships.join('\n\n')}</div></div>` : ''}
                ${profile.projects && profile.projects.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#235789] border-b-2 border-[#87A8D0] pb-0.5 mb-1.5 uppercase mt-2">Projects</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.projects.join('\n\n')}</div></div>` : ''}
                ${profile.volunteer && profile.volunteer.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#235789] border-b-2 border-[#87A8D0] pb-0.5 mb-1.5 uppercase mt-2">Volunteer Work</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.volunteer.join('\n\n')}</div></div>` : ''}
                ${profile.extracurriculars && profile.extracurriculars.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#235789] border-b-2 border-[#87A8D0] pb-0.5 mb-1.5 uppercase mt-2">Extracurriculars</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.extracurriculars.join('\n\n')}</div></div>` : ''}
                ${profile.education ? `<div><h2 class="text-[11px] font-bold text-[#235789] border-b-2 border-[#87A8D0] pb-0.5 mb-1.5 uppercase mt-2">Education</h2><p class="text-xs text-gray-800 whitespace-pre-line">${profile.education}</p></div>` : ''}
                ${profile.bar_admissions && profile.bar_admissions.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#235789] border-b-2 border-[#87A8D0] pb-0.5 mb-1.5 uppercase mt-2">Bar Admissions</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.bar_admissions.map(b => `<li>${b}</li>`).join('')}</ul></div>` : ''}
                ${profile.publications && profile.publications.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#235789] border-b-2 border-[#87A8D0] pb-0.5 mb-1.5 uppercase mt-2">Publications</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.publications.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
                ${profile.skills && profile.skills.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#235789] border-b-2 border-[#87A8D0] pb-0.5 mb-1.5 uppercase mt-2">Skills</h2><p class="text-xs text-gray-800 leading-relaxed">${profile.skills.join(', ')}</p></div>` : ''}
                ${profile.certifications && profile.certifications.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#235789] border-b-2 border-[#87A8D0] pb-0.5 mb-1.5 uppercase mt-2">Certifications</h2><ul class="list-disc list-inside text-xs text-gray-800 space-y-1">${profile.certifications.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                ${profile.personal_details && profile.personal_details.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#235789] border-b-2 border-[#87A8D0] pb-0.5 mb-1.5 uppercase mt-2">Personal Details</h2><ul class="text-xs text-gray-800 space-y-1">${profile.personal_details.map(p => `<li><strong>${p.label}:</strong> ${p.value}</li>`).join('')}</ul></div>` : ''}
            </div>
        </div>
        `;
    },

    // 9. NEW: CREATIVE CORAL
    creative_coral: function(profile, expFormatted) {
        return `
        <div style="font-family: Arial, sans-serif;">
            <div class="bg-[#C84B31] text-center text-white py-5 px-4 mb-4">
                <h1 class="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-1">${profile.name}</h1>
                <p class="text-[11px] font-semibold text-orange-50 tracking-wider mb-2 leading-relaxed">${profile.title}</p>
                <p class="text-[9px] opacity-90">${profile.contact.replace(/ \| /g, '  |  ')}</p>
                ${profile.portfolio_links && profile.portfolio_links.length > 0 ? `<p class="text-[9px] opacity-90 mt-1">${profile.portfolio_links.join('  |  ')}</p>` : ''}
            </div>
            <div class="space-y-3 px-2">
                <div><h2 class="text-[11px] font-bold text-[#C84B31] border-b border-[#C84B31] pb-0.5 mb-1.5 uppercase tracking-wider">Profile</h2><p class="text-xs text-gray-800 leading-relaxed">${profile.summary}</p></div>
                ${profile.achievements && profile.achievements.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#C84B31] border-b border-[#C84B31] pb-0.5 mb-1.5 uppercase tracking-wider mt-2">Achievements</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
                ${profile.technical_skills && profile.technical_skills.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#C84B31] border-b border-[#C84B31] pb-0.5 mb-1.5 uppercase tracking-wider mt-2">Technical Profile</h2><div class="text-xs text-gray-800 space-y-1">${profile.technical_skills.map(t => `<div class="flex"><span class="font-bold w-1/4 uppercase">${t.category}:</span><span class="w-3/4">${t.skills.join(', ')}</span></div>`).join('')}</div></div>` : ''}
                ${profile.clinical_rotations && profile.clinical_rotations.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#C84B31] border-b border-[#C84B31] pb-0.5 mb-1.5 uppercase tracking-wider mt-2">Clinical Rotations</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.clinical_rotations.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                <div><h2 class="text-[11px] font-bold text-[#C84B31] border-b border-[#C84B31] pb-0.5 mb-1.5 uppercase tracking-wider mt-2">Experience</h2><div class="text-xs text-gray-800">${expFormatted}</div></div>
                ${profile.internships && profile.internships.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#C84B31] border-b border-[#C84B31] pb-0.5 mb-1.5 uppercase tracking-wider mt-2">Internships</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.internships.join('\n\n')}</div></div>` : ''}
                ${profile.projects && profile.projects.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#C84B31] border-b border-[#C84B31] pb-0.5 mb-1.5 uppercase tracking-wider mt-2">Projects</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.projects.join('\n\n')}</div></div>` : ''}
                ${profile.volunteer && profile.volunteer.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#C84B31] border-b border-[#C84B31] pb-0.5 mb-1.5 uppercase tracking-wider mt-2">Volunteer Work</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.volunteer.join('\n\n')}</div></div>` : ''}
                ${profile.extracurriculars && profile.extracurriculars.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#C84B31] border-b border-[#C84B31] pb-0.5 mb-1.5 uppercase tracking-wider mt-2">Extracurriculars</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.extracurriculars.join('\n\n')}</div></div>` : ''}
                ${profile.education ? `<div><h2 class="text-[11px] font-bold text-[#C84B31] border-b border-[#C84B31] pb-0.5 mb-1.5 uppercase tracking-wider mt-2">Education</h2><p class="text-xs text-gray-800 whitespace-pre-line">${profile.education}</p></div>` : ''}
                ${profile.bar_admissions && profile.bar_admissions.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#C84B31] border-b border-[#C84B31] pb-0.5 mb-1.5 uppercase tracking-wider mt-2">Bar Admissions</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.bar_admissions.map(b => `<li>${b}</li>`).join('')}</ul></div>` : ''}
                ${profile.publications && profile.publications.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#C84B31] border-b border-[#C84B31] pb-0.5 mb-1.5 uppercase tracking-wider mt-2">Publications</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.publications.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
                ${profile.skills && profile.skills.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#C84B31] border-b border-[#C84B31] pb-0.5 mb-1.5 uppercase tracking-wider mt-2">Skills & Tools</h2><p class="text-xs text-gray-800 leading-relaxed">${profile.skills.join(' • ')}</p></div>` : ''}
                ${profile.certifications && profile.certifications.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#C84B31] border-b border-[#C84B31] pb-0.5 mb-1.5 uppercase tracking-wider mt-2">Certifications</h2><ul class="list-disc list-inside text-xs text-gray-800 space-y-1">${profile.certifications.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                ${profile.personal_details && profile.personal_details.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#C84B31] border-b border-[#C84B31] pb-0.5 mb-1.5 uppercase tracking-wider mt-2">Personal Details</h2><ul class="text-xs text-gray-800 space-y-1">${profile.personal_details.map(p => `<li><strong>${p.label}:</strong> ${p.value}</li>`).join('')}</ul></div>` : ''}
            </div>
        </div>
        `;
    },

    // 10. NEW: EXECUTIVE TEAL
    executive_teal: function(profile, expFormatted) {
        return `
        <div style="font-family: Arial, sans-serif;">
            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-4 space-y-4 border-r-2 border-teal-100 pr-4 pt-2">
                    <div><h3 class="text-[10px] font-bold text-[#1A6359] uppercase tracking-wider mb-1.5">Contact</h3><p class="text-[10px] text-gray-700 leading-relaxed">${profile.contact.replace(/ \| /g, '<br>')}</p>${profile.portfolio_links && profile.portfolio_links.length > 0 ? `<div class="mt-1 text-[10px] text-teal-700 font-medium">${profile.portfolio_links.join('<br>')}</div>` : ''}</div>
                    ${profile.education ? `<div><h3 class="text-[10px] font-bold text-[#1A6359] uppercase tracking-wider mb-1.5 mt-3">Education</h3><p class="text-[10px] text-gray-700 whitespace-pre-line">${profile.education}</p></div>` : ''}
                    ${profile.bar_admissions && profile.bar_admissions.length > 0 ? `<div><h3 class="text-[10px] font-bold text-[#1A6359] uppercase tracking-wider mb-1.5 mt-3">Bar Admissions</h3><ul class="text-[10px] text-gray-700 space-y-1">${profile.bar_admissions.map(b => `<li>${b}</li>`).join('')}</ul></div>` : ''}
                    ${profile.publications && profile.publications.length > 0 ? `<div><h3 class="text-[10px] font-bold text-[#1A6359] uppercase tracking-wider mb-1.5 mt-3">Publications</h3><ul class="text-[10px] text-gray-700 space-y-1">${profile.publications.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
                    ${profile.skills && profile.skills.length > 0 ? `<div><h3 class="text-[10px] font-bold text-[#1A6359] uppercase tracking-wider mb-1.5 mt-3">Skills</h3><ul class="text-[10px] text-gray-700 space-y-1">${profile.skills.slice(0,6).map(s => `<li>${s}</li>`).join('')}</ul></div>` : ''}
                    ${profile.certifications && profile.certifications.length > 0 ? `<div><h3 class="text-[10px] font-bold text-[#1A6359] uppercase tracking-wider mb-1.5 mt-3">Certifications</h3><ul class="text-[10px] text-gray-700 space-y-1">${profile.certifications.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                    ${profile.personal_details && profile.personal_details.length > 0 ? `<div><h3 class="text-[10px] font-bold text-[#1A6359] uppercase tracking-wider mb-1.5 mt-3">Personal Details</h3><ul class="text-[10px] text-gray-700 space-y-1">${profile.personal_details.map(p => `<li><strong>${p.label}:</strong> ${p.value}</li>`).join('')}</ul></div>` : ''}
                </div>
                <div class="col-span-8">
                    <div class="bg-[#1A6359] text-white p-5 rounded-lg mb-5">
                        <h1 class="text-2xl md:text-3xl font-bold uppercase tracking-wider">${profile.name}</h1>
                        <p class="text-xs font-medium text-teal-50 mt-1.5 leading-relaxed">${profile.title}</p>
                    </div>
                    <div class="space-y-4">
                        <div><h3 class="text-[10px] font-bold text-[#1A6359] border-b border-teal-200 pb-0.5 uppercase tracking-wider mb-1.5">Professional Summary</h3><p class="text-xs text-gray-800 leading-relaxed">${profile.summary}</p></div>
                        ${profile.achievements && profile.achievements.length > 0 ? `<div><h3 class="text-[10px] font-bold text-[#1A6359] border-b border-teal-200 pb-0.5 uppercase tracking-wider mb-1.5 mt-3">Achievements</h3><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
                        ${profile.technical_skills && profile.technical_skills.length > 0 ? `<div><h3 class="text-[10px] font-bold text-[#1A6359] border-b border-teal-200 pb-0.5 uppercase tracking-wider mb-1.5 mt-3">Technical Profile</h3><div class="text-xs text-gray-800 space-y-1">${profile.technical_skills.map(t => `<div class="flex"><span class="font-bold w-1/4 uppercase">${t.category}:</span><span class="w-3/4">${t.skills.join(', ')}</span></div>`).join('')}</div></div>` : ''}
                        ${profile.clinical_rotations && profile.clinical_rotations.length > 0 ? `<div><h3 class="text-[10px] font-bold text-[#1A6359] border-b border-teal-200 pb-0.5 uppercase tracking-wider mb-1.5 mt-3">Clinical Rotations</h3><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.clinical_rotations.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                        <div><h3 class="text-[10px] font-bold text-[#1A6359] border-b border-teal-200 pb-0.5 uppercase tracking-wider mb-1.5 mt-3">Work Experience</h3><div class="text-xs text-gray-800">${expFormatted}</div></div>
                        ${profile.internships && profile.internships.length > 0 ? `<div><h3 class="text-[10px] font-bold text-[#1A6359] border-b border-teal-200 pb-0.5 uppercase tracking-wider mb-1.5 mt-3">Internships</h3><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.internships.join('\n\n')}</div></div>` : ''}
                        ${profile.projects && profile.projects.length > 0 ? `<div><h3 class="text-[10px] font-bold text-[#1A6359] border-b border-teal-200 pb-0.5 uppercase tracking-wider mb-1.5 mt-3">Projects</h3><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.projects.join('\n\n')}</div></div>` : ''}
                        ${profile.volunteer && profile.volunteer.length > 0 ? `<div><h3 class="text-[10px] font-bold text-[#1A6359] border-b border-teal-200 pb-0.5 uppercase tracking-wider mb-1.5 mt-3">Volunteer Work</h3><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.volunteer.join('\n\n')}</div></div>` : ''}
                        ${profile.extracurriculars && profile.extracurriculars.length > 0 ? `<div><h3 class="text-[10px] font-bold text-[#1A6359] border-b border-teal-200 pb-0.5 uppercase tracking-wider mb-1.5 mt-3">Extracurriculars</h3><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.extracurriculars.join('\n\n')}</div></div>` : ''}
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    // 11. NEW: MERIDIAN
    meridian: function(profile, expFormatted) {
        return `
        <div style="font-family: Arial, sans-serif;">
            <div class="mb-4">
                <h1 class="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">${profile.name}</h1>
                <p class="text-sm font-bold text-gray-800 mt-1.5 leading-relaxed">${profile.title}</p>
                <p class="text-[10px] text-gray-500 mt-0.5 font-medium">${profile.contact.replace(/ \| /g, ' | ')}</p>
                ${profile.portfolio_links && profile.portfolio_links.length > 0 ? `<p class="text-[10px] text-blue-600 mt-0.5 font-medium">${profile.portfolio_links.join(' | ')}</p>` : ''}
            </div>
            <div class="space-y-4">
                <div><h2 class="text-[11px] font-extrabold text-gray-900 uppercase tracking-widest mb-2 border-b-2 border-gray-900 pb-1">About</h2><p class="text-xs text-gray-800 leading-relaxed">${profile.summary}</p></div>
                ${profile.achievements && profile.achievements.length > 0 ? `<div><h2 class="text-[11px] font-extrabold text-gray-900 uppercase tracking-widest mb-2 border-b-2 border-gray-900 pb-1 mt-3">Achievements</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
                ${profile.technical_skills && profile.technical_skills.length > 0 ? `<div><h2 class="text-[11px] font-extrabold text-gray-900 uppercase tracking-widest mb-2 border-b-2 border-gray-900 pb-1 mt-3">Technical Profile</h2><div class="text-xs text-gray-800 space-y-1">${profile.technical_skills.map(t => `<div class="flex"><span class="font-bold w-1/4 uppercase">${t.category}:</span><span class="w-3/4">${t.skills.join(', ')}</span></div>`).join('')}</div></div>` : ''}
                ${profile.clinical_rotations && profile.clinical_rotations.length > 0 ? `<div><h2 class="text-[11px] font-extrabold text-gray-900 uppercase tracking-widest mb-2 border-b-2 border-gray-900 pb-1 mt-3">Clinical Rotations</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.clinical_rotations.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                <div><h2 class="text-[11px] font-extrabold text-gray-900 uppercase tracking-widest mb-2 border-b-2 border-gray-900 pb-1 mt-3">Experience</h2><div class="text-xs text-gray-800">${expFormatted}</div></div>
                ${profile.internships && profile.internships.length > 0 ? `<div><h2 class="text-[11px] font-extrabold text-gray-900 uppercase tracking-widest mb-2 border-b-2 border-gray-900 pb-1 mt-3">Internships</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.internships.join('\n\n')}</div></div>` : ''}
                ${profile.projects && profile.projects.length > 0 ? `<div><h2 class="text-[11px] font-extrabold text-gray-900 uppercase tracking-widest mb-2 border-b-2 border-gray-900 pb-1 mt-3">Projects</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.projects.join('\n\n')}</div></div>` : ''}
                ${profile.volunteer && profile.volunteer.length > 0 ? `<div><h2 class="text-[11px] font-extrabold text-gray-900 uppercase tracking-widest mb-2 border-b-2 border-gray-900 pb-1 mt-3">Volunteer Work</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.volunteer.join('\n\n')}</div></div>` : ''}
                ${profile.extracurriculars && profile.extracurriculars.length > 0 ? `<div><h2 class="text-[11px] font-extrabold text-gray-900 uppercase tracking-widest mb-2 border-b-2 border-gray-900 pb-1 mt-3">Extracurriculars</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.extracurriculars.join('\n\n')}</div></div>` : ''}
                <div class="grid grid-cols-2 gap-4 mt-3">
                    ${profile.education ? `<div><h2 class="text-[11px] font-extrabold text-gray-900 uppercase tracking-widest mb-2 border-b-2 border-gray-900 pb-1">Education</h2><p class="text-xs text-gray-800 whitespace-pre-line">${profile.education}</p></div>` : ''}
                    ${profile.bar_admissions && profile.bar_admissions.length > 0 ? `<div><h2 class="text-[11px] font-extrabold text-gray-900 uppercase tracking-widest mb-2 border-b-2 border-gray-900 pb-1">Bar Admissions</h2><ul class="list-disc list-inside text-xs text-gray-800 space-y-1">${profile.bar_admissions.map(b => `<li>${b}</li>`).join('')}</ul></div>` : ''}
                    ${profile.publications && profile.publications.length > 0 ? `<div><h2 class="text-[11px] font-extrabold text-gray-900 uppercase tracking-widest mb-2 border-b-2 border-gray-900 pb-1">Publications</h2><ul class="list-disc list-inside text-xs text-gray-800 space-y-1">${profile.publications.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
                    ${profile.skills && profile.skills.length > 0 ? `<div><h2 class="text-[11px] font-extrabold text-gray-900 uppercase tracking-widest mb-2 border-b-2 border-gray-900 pb-1">Technical Skills</h2><p class="text-xs text-gray-800 leading-relaxed">${profile.skills.join(', ')}</p></div>` : ''}
                    ${profile.certifications && profile.certifications.length > 0 ? `<div><h2 class="text-[11px] font-extrabold text-gray-900 uppercase tracking-widest mb-2 border-b-2 border-gray-900 pb-1">Certifications</h2><ul class="list-disc list-inside text-xs text-gray-800 space-y-1">${profile.certifications.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                    ${profile.personal_details && profile.personal_details.length > 0 ? `<div><h2 class="text-[11px] font-extrabold text-gray-900 uppercase tracking-widest mb-2 border-b-2 border-gray-900 pb-1">Personal Details</h2><ul class="text-xs text-gray-800 space-y-1">${profile.personal_details.map(p => `<li><strong>${p.label}:</strong> ${p.value}</li>`).join('')}</ul></div>` : ''}
                </div>
            </div>
        </div>
        `;
    },

    // 12. NEW: MINIMAL GREY
    minimal_grey: function(profile, expFormatted) {
        return `
        <div style="font-family: Arial, sans-serif;">
            <div class="border-b border-gray-300 pb-4 mb-4">
                <h1 class="text-3xl font-bold text-gray-800 tracking-tight">${profile.name}</h1>
                <p class="text-xs font-bold text-gray-600 mt-1.5 leading-relaxed">${profile.title}</p>
                <p class="text-[10px] text-gray-500 mt-0.5">${profile.contact.replace(/ \| /g, ' • ')}</p>
                ${profile.portfolio_links && profile.portfolio_links.length > 0 ? `<p class="text-[10px] text-blue-600 mt-0.5">${profile.portfolio_links.join(' • ')}</p>` : ''}
            </div>
            <div class="space-y-3">
                <div><h2 class="text-[10px] font-bold text-gray-800 uppercase tracking-wider bg-gray-100 py-1 px-2 mb-2 rounded-sm">Summary</h2><p class="text-xs text-gray-600 leading-relaxed">${profile.summary}</p></div>
                ${profile.achievements && profile.achievements.length > 0 ? `<div><h2 class="text-[10px] font-bold text-gray-800 uppercase tracking-wider bg-gray-100 py-1 px-2 mb-2 mt-3 rounded-sm">Achievements</h2><ul class="list-disc pl-4 text-xs text-gray-600 space-y-1">${profile.achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
                ${profile.technical_skills && profile.technical_skills.length > 0 ? `<div><h2 class="text-[10px] font-bold text-gray-800 uppercase tracking-wider bg-gray-100 py-1 px-2 mb-2 mt-3 rounded-sm">Technical Profile</h2><div class="text-xs text-gray-600 space-y-1 px-2">${profile.technical_skills.map(t => `<div class="flex"><span class="font-bold w-1/4 uppercase">${t.category}:</span><span class="w-3/4">${t.skills.join(', ')}</span></div>`).join('')}</div></div>` : ''}
                ${profile.clinical_rotations && profile.clinical_rotations.length > 0 ? `<div><h2 class="text-[10px] font-bold text-gray-800 uppercase tracking-wider bg-gray-100 py-1 px-2 mb-2 mt-3 rounded-sm">Clinical Rotations</h2><ul class="list-disc pl-4 text-xs text-gray-600 space-y-1">${profile.clinical_rotations.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                <div><h2 class="text-[10px] font-bold text-gray-800 uppercase tracking-wider bg-gray-100 py-1 px-2 mb-2 mt-3 rounded-sm">Experience</h2><div class="text-xs text-gray-600">${expFormatted}</div></div>
                ${profile.internships && profile.internships.length > 0 ? `<div><h2 class="text-[10px] font-bold text-gray-800 uppercase tracking-wider bg-gray-100 py-1 px-2 mb-2 mt-3 rounded-sm">Internships</h2><div class="text-xs text-gray-600 whitespace-pre-line leading-relaxed">${profile.internships.join('\n\n')}</div></div>` : ''}
                ${profile.projects && profile.projects.length > 0 ? `<div><h2 class="text-[10px] font-bold text-gray-800 uppercase tracking-wider bg-gray-100 py-1 px-2 mb-2 mt-3 rounded-sm">Projects</h2><div class="text-xs text-gray-600 whitespace-pre-line leading-relaxed">${profile.projects.join('\n\n')}</div></div>` : ''}
                ${profile.volunteer && profile.volunteer.length > 0 ? `<div><h2 class="text-[10px] font-bold text-gray-800 uppercase tracking-wider bg-gray-100 py-1 px-2 mb-2 mt-3 rounded-sm">Volunteer Work</h2><div class="text-xs text-gray-600 whitespace-pre-line leading-relaxed">${profile.volunteer.join('\n\n')}</div></div>` : ''}
                ${profile.extracurriculars && profile.extracurriculars.length > 0 ? `<div><h2 class="text-[10px] font-bold text-gray-800 uppercase tracking-wider bg-gray-100 py-1 px-2 mb-2 mt-3 rounded-sm">Extracurriculars</h2><div class="text-xs text-gray-600 whitespace-pre-line leading-relaxed">${profile.extracurriculars.join('\n\n')}</div></div>` : ''}
                ${profile.education ? `<div><h2 class="text-[10px] font-bold text-gray-800 uppercase tracking-wider bg-gray-100 py-1 px-2 mb-2 mt-3 rounded-sm">Education</h2><p class="text-xs text-gray-600 whitespace-pre-line">${profile.education}</p></div>` : ''}
                ${profile.bar_admissions && profile.bar_admissions.length > 0 ? `<div><h2 class="text-[10px] font-bold text-gray-800 uppercase tracking-wider bg-gray-100 py-1 px-2 mb-2 mt-3 rounded-sm">Bar Admissions</h2><ul class="list-disc list-inside text-xs text-gray-600 space-y-1">${profile.bar_admissions.map(b => `<li>${b}</li>`).join('')}</ul></div>` : ''}
                ${profile.publications && profile.publications.length > 0 ? `<div><h2 class="text-[10px] font-bold text-gray-800 uppercase tracking-wider bg-gray-100 py-1 px-2 mb-2 mt-3 rounded-sm">Publications</h2><ul class="list-disc list-inside text-xs text-gray-600 space-y-1">${profile.publications.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
                ${profile.skills && profile.skills.length > 0 ? `<div><h2 class="text-[10px] font-bold text-gray-800 uppercase tracking-wider bg-gray-100 py-1 px-2 mb-2 mt-3 rounded-sm">Skills</h2><p class="text-xs text-gray-600 leading-relaxed">${profile.skills.join(' | ')}</p></div>` : ''}
                ${profile.certifications && profile.certifications.length > 0 ? `<div><h2 class="text-[10px] font-bold text-gray-800 uppercase tracking-wider bg-gray-100 py-1 px-2 mb-2 mt-3 rounded-sm">Certifications</h2><ul class="list-disc list-inside text-xs text-gray-600 space-y-1">${profile.certifications.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                ${profile.personal_details && profile.personal_details.length > 0 ? `<div><h2 class="text-[10px] font-bold text-gray-800 uppercase tracking-wider bg-gray-100 py-1 px-2 mb-2 mt-3 rounded-sm">Personal Details</h2><ul class="text-xs text-gray-600 space-y-1">${profile.personal_details.map(p => `<li><strong>${p.label}:</strong> ${p.value}</li>`).join('')}</ul></div>` : ''}
            </div>
        </div>
        `;
    },
    
    // 13. NEW: NAVY EXECUTIVE
    navy_executive: function(profile, expFormatted) {
        return `
        <div style="font-family: Arial, sans-serif;">
            <div class="bg-[#1A365D] text-white p-6 mb-5">
                <h1 class="text-3xl font-bold uppercase tracking-wider">${profile.name}</h1>
                <div class="border-t border-blue-400 mt-2 pt-2">
                    <p class="text-xs text-white font-semibold tracking-wide leading-relaxed">${profile.title}</p>
                    <p class="text-[10px] text-blue-200 mt-1">${profile.contact.replace(/ \| /g, ' | ')}</p>
                    ${profile.portfolio_links && profile.portfolio_links.length > 0 ? `<p class="text-[10px] text-blue-100 mt-0.5">${profile.portfolio_links.join(' | ')}</p>` : ''}
                </div>
            </div>
            <div class="space-y-4 px-2">
                <div><h2 class="text-[11px] font-bold text-[#1A365D] uppercase tracking-widest border-b-2 border-[#1A365D] pb-1 mb-2">Executive Profile</h2><p class="text-xs text-gray-800 leading-relaxed">${profile.summary}</p></div>
                ${profile.achievements && profile.achievements.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#1A365D] uppercase tracking-widest border-b-2 border-[#1A365D] pb-1 mb-2 mt-4">Achievements</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
                ${profile.technical_skills && profile.technical_skills.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#1A365D] uppercase tracking-widest border-b-2 border-[#1A365D] pb-1 mb-2 mt-4">Technical Profile</h2><div class="text-xs text-gray-800 space-y-1">${profile.technical_skills.map(t => `<div class="flex"><span class="font-bold w-1/4 uppercase">${t.category}:</span><span class="w-3/4">${t.skills.join(', ')}</span></div>`).join('')}</div></div>` : ''}
                ${profile.clinical_rotations && profile.clinical_rotations.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#1A365D] uppercase tracking-widest border-b-2 border-[#1A365D] pb-1 mb-2 mt-4">Clinical Rotations</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.clinical_rotations.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                <div><h2 class="text-[11px] font-bold text-[#1A365D] uppercase tracking-widest border-b-2 border-[#1A365D] pb-1 mb-2 mt-4">Professional Experience</h2><div class="text-xs text-gray-800">${expFormatted}</div></div>
                ${profile.internships && profile.internships.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#1A365D] uppercase tracking-widest border-b-2 border-[#1A365D] pb-1 mb-2 mt-4">Internships</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.internships.join('\n\n')}</div></div>` : ''}
                ${profile.projects && profile.projects.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#1A365D] uppercase tracking-widest border-b-2 border-[#1A365D] pb-1 mb-2 mt-4">Projects</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.projects.join('\n\n')}</div></div>` : ''}
                ${profile.volunteer && profile.volunteer.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#1A365D] uppercase tracking-widest border-b-2 border-[#1A365D] pb-1 mb-2 mt-4">Volunteer Work</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.volunteer.join('\n\n')}</div></div>` : ''}
                ${profile.extracurriculars && profile.extracurriculars.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#1A365D] uppercase tracking-widest border-b-2 border-[#1A365D] pb-1 mb-2 mt-4">Extracurriculars</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.extracurriculars.join('\n\n')}</div></div>` : ''}
                ${profile.education ? `<div><h2 class="text-[11px] font-bold text-[#1A365D] uppercase tracking-widest border-b-2 border-[#1A365D] pb-1 mb-2 mt-4">Education</h2><p class="text-xs text-gray-800 whitespace-pre-line">${profile.education}</p></div>` : ''}
                ${profile.bar_admissions && profile.bar_admissions.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#1A365D] uppercase tracking-widest border-b-2 border-[#1A365D] pb-1 mb-2 mt-4">Bar Admissions</h2><ul class="text-xs text-gray-800 list-disc pl-4 space-y-1">${profile.bar_admissions.map(b => `<li>${b}</li>`).join('')}</ul></div>` : ''}
                ${profile.publications && profile.publications.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#1A365D] uppercase tracking-widest border-b-2 border-[#1A365D] pb-1 mb-2 mt-4">Publications</h2><ul class="text-xs text-gray-800 list-disc pl-4 space-y-1">${profile.publications.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
                ${profile.certifications && profile.certifications.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#1A365D] uppercase tracking-widest border-b-2 border-[#1A365D] pb-1 mb-2 mt-4">Board Roles & Certifications</h2><ul class="text-xs text-gray-800 list-disc pl-4 space-y-1">${profile.certifications.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                ${profile.personal_details && profile.personal_details.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#1A365D] uppercase tracking-widest border-b-2 border-[#1A365D] pb-1 mb-2 mt-4">Personal Details</h2><ul class="text-xs text-gray-800 space-y-1">${profile.personal_details.map(p => `<li><strong>${p.label}:</strong> ${p.value}</li>`).join('')}</ul></div>` : ''}
            </div>
        </div>
        `;
    },

    // 14. NEW: OLIVE TECH
    olive_tech: function(profile, expFormatted) {
        return `
        <div style="font-family: Arial, sans-serif;">
            <div class="bg-[#4B5320] text-white p-5 mb-4 rounded-sm">
                <h1 class="text-3xl font-extrabold uppercase tracking-widest">${profile.name}</h1>
                <p class="text-[11px] font-semibold text-[#C5E1A5] mt-1.5 leading-relaxed">${profile.title}</p>
                <p class="text-[9px] text-gray-200 mt-1">${profile.contact.replace(/ \| /g, ' • ')}</p>
                ${profile.portfolio_links && profile.portfolio_links.length > 0 ? `<p class="text-[9px] text-green-200 mt-0.5">${profile.portfolio_links.join(' • ')}</p>` : ''}
            </div>
            <div class="space-y-3 px-1">
                <div><h2 class="text-[10px] font-bold text-[#4B5320] uppercase tracking-wider border-b border-[#4B5320] pb-0.5 mb-1.5">Summary</h2><p class="text-xs text-gray-700 leading-relaxed">${profile.summary}</p></div>
                ${profile.achievements && profile.achievements.length > 0 ? `<div><h2 class="text-[10px] font-bold text-[#4B5320] uppercase tracking-wider border-b border-[#4B5320] pb-0.5 mb-1.5 mt-3">Achievements</h2><ul class="list-disc pl-4 text-xs text-gray-700 space-y-1">${profile.achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
                ${profile.technical_skills && profile.technical_skills.length > 0 ? `<div><h2 class="text-[10px] font-bold text-[#4B5320] uppercase tracking-wider border-b border-[#4B5320] pb-0.5 mb-1.5 mt-3">Technical Profile</h2><div class="text-xs text-gray-700 space-y-1">${profile.technical_skills.map(t => `<div class="flex"><span class="font-bold w-1/4 uppercase">${t.category}:</span><span class="w-3/4">${t.skills.join(', ')}</span></div>`).join('')}</div></div>` : ''}
                ${profile.clinical_rotations && profile.clinical_rotations.length > 0 ? `<div><h2 class="text-[10px] font-bold text-[#4B5320] uppercase tracking-wider border-b border-[#4B5320] pb-0.5 mb-1.5 mt-3">Clinical Rotations</h2><ul class="list-disc pl-4 text-xs text-gray-700 space-y-1">${profile.clinical_rotations.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                <div><h2 class="text-[10px] font-bold text-[#4B5320] uppercase tracking-wider border-b border-[#4B5320] pb-0.5 mb-1.5 mt-3">Work Experience</h2><div class="text-xs text-gray-700">${expFormatted}</div></div>
                ${profile.internships && profile.internships.length > 0 ? `<div><h2 class="text-[10px] font-bold text-[#4B5320] uppercase tracking-wider border-b border-[#4B5320] pb-0.5 mb-1.5 mt-3">Internships</h2><div class="text-xs text-gray-700 whitespace-pre-line leading-relaxed">${profile.internships.join('\n\n')}</div></div>` : ''}
                ${profile.projects && profile.projects.length > 0 ? `<div><h2 class="text-[10px] font-bold text-[#4B5320] uppercase tracking-wider border-b border-[#4B5320] pb-0.5 mb-1.5 mt-3">Projects</h2><div class="text-xs text-gray-700 whitespace-pre-line leading-relaxed">${profile.projects.join('\n\n')}</div></div>` : ''}
                ${profile.volunteer && profile.volunteer.length > 0 ? `<div><h2 class="text-[10px] font-bold text-[#4B5320] uppercase tracking-wider border-b border-[#4B5320] pb-0.5 mb-1.5 mt-3">Volunteer Work</h2><div class="text-xs text-gray-700 whitespace-pre-line leading-relaxed">${profile.volunteer.join('\n\n')}</div></div>` : ''}
                ${profile.extracurriculars && profile.extracurriculars.length > 0 ? `<div><h2 class="text-[10px] font-bold text-[#4B5320] uppercase tracking-wider border-b border-[#4B5320] pb-0.5 mb-1.5 mt-3">Extracurriculars</h2><div class="text-xs text-gray-700 whitespace-pre-line leading-relaxed">${profile.extracurriculars.join('\n\n')}</div></div>` : ''}
                ${profile.education ? `<div><h2 class="text-[10px] font-bold text-[#4B5320] uppercase tracking-wider border-b border-[#4B5320] pb-0.5 mb-1.5 mt-3">Education</h2><p class="text-xs text-gray-700 whitespace-pre-line">${profile.education}</p></div>` : ''}
                ${profile.bar_admissions && profile.bar_admissions.length > 0 ? `<div><h2 class="text-[10px] font-bold text-[#4B5320] uppercase tracking-wider border-b border-[#4B5320] pb-0.5 mb-1.5 mt-3">Bar Admissions</h2><ul class="text-xs text-gray-700 list-disc list-inside space-y-1">${profile.bar_admissions.map(b => `<li>${b}</li>`).join('')}</ul></div>` : ''}
                ${profile.publications && profile.publications.length > 0 ? `<div><h2 class="text-[10px] font-bold text-[#4B5320] uppercase tracking-wider border-b border-[#4B5320] pb-0.5 mb-1.5 mt-3">Publications</h2><ul class="text-xs text-gray-700 list-disc list-inside space-y-1">${profile.publications.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
                ${profile.skills && profile.skills.length > 0 ? `<div><h2 class="text-[10px] font-bold text-[#4B5320] uppercase tracking-wider border-b border-[#4B5320] pb-0.5 mb-1.5 mt-3">Technical Skills</h2><p class="text-xs text-gray-700 leading-relaxed">${profile.skills.join(', ')}</p></div>` : ''}
                ${profile.certifications && profile.certifications.length > 0 ? `<div><h2 class="text-[10px] font-bold text-[#4B5320] uppercase tracking-wider border-b border-[#4B5320] pb-0.5 mb-1.5 mt-3">Certifications</h2><ul class="text-xs text-gray-700 list-disc list-inside space-y-1">${profile.certifications.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                ${profile.personal_details && profile.personal_details.length > 0 ? `<div><h2 class="text-[10px] font-bold text-[#4B5320] uppercase tracking-wider border-b border-[#4B5320] pb-0.5 mb-1.5 mt-3">Personal Details</h2><ul class="text-xs text-gray-700 space-y-1">${profile.personal_details.map(p => `<li><strong>${p.label}:</strong> ${p.value}</li>`).join('')}</ul></div>` : ''}
            </div>
        </div>
        `;
    },

    // 15. NEW: PINNACLE
    pinnacle: function(profile, expFormatted) {
        return `
        <div style="font-family: Georgia, serif;">
            <div class="text-center border-b-[2px] border-black pb-3 mb-4 font-serif">
                <h1 class="text-4xl font-bold uppercase tracking-widest mb-2">${profile.name}</h1>
                <p class="text-[11px] font-bold text-gray-800 leading-relaxed">${profile.title}</p>
                <p class="text-[9px] text-gray-600 mt-1">${profile.contact}</p>
                ${profile.portfolio_links && profile.portfolio_links.length > 0 ? `<p class="text-[9px] text-blue-700 mt-0.5">${profile.portfolio_links.join(' | ')}</p>` : ''}
            </div>
            <div class="space-y-4 font-serif px-4">
                <div><h2 class="text-[10px] font-bold text-black text-center uppercase tracking-[0.3em] border-b border-gray-300 pb-1 mb-2">Professional Summary</h2><p class="text-xs text-gray-900 leading-relaxed text-justify">${profile.summary}</p></div>
                ${profile.achievements && profile.achievements.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black text-center uppercase tracking-[0.3em] border-b border-gray-300 pb-1 mb-2 mt-4">Achievements</h2><ul class="list-disc list-inside text-xs text-gray-900 space-y-1">${profile.achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
                ${profile.technical_skills && profile.technical_skills.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black text-center uppercase tracking-[0.3em] border-b border-gray-300 pb-1 mb-2 mt-4">Technical Profile</h2><div class="text-xs text-gray-900 space-y-1">${profile.technical_skills.map(t => `<div class="flex"><span class="font-bold w-1/4 uppercase text-right pr-4">${t.category}:</span><span class="w-3/4 text-left">${t.skills.join(', ')}</span></div>`).join('')}</div></div>` : ''}
                ${profile.clinical_rotations && profile.clinical_rotations.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black text-center uppercase tracking-[0.3em] border-b border-gray-300 pb-1 mb-2 mt-4">Clinical Rotations</h2><ul class="list-disc list-inside text-xs text-gray-900 space-y-1">${profile.clinical_rotations.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                <div><h2 class="text-[10px] font-bold text-black text-center uppercase tracking-[0.3em] border-b border-gray-300 pb-1 mb-2 mt-4">Professional Experience</h2><div class="text-xs text-gray-900">${expFormatted}</div></div>
                ${profile.internships && profile.internships.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black text-center uppercase tracking-[0.3em] border-b border-gray-300 pb-1 mb-2 mt-4">Internships</h2><div class="text-xs text-gray-900 whitespace-pre-line leading-relaxed">${profile.internships.join('\n\n')}</div></div>` : ''}
                ${profile.projects && profile.projects.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black text-center uppercase tracking-[0.3em] border-b border-gray-300 pb-1 mb-2 mt-4">Projects</h2><div class="text-xs text-gray-900 whitespace-pre-line leading-relaxed">${profile.projects.join('\n\n')}</div></div>` : ''}
                ${profile.volunteer && profile.volunteer.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black text-center uppercase tracking-[0.3em] border-b border-gray-300 pb-1 mb-2 mt-4">Volunteer Work</h2><div class="text-xs text-gray-900 whitespace-pre-line leading-relaxed">${profile.volunteer.join('\n\n')}</div></div>` : ''}
                ${profile.extracurriculars && profile.extracurriculars.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black text-center uppercase tracking-[0.3em] border-b border-gray-300 pb-1 mb-2 mt-4">Extracurriculars</h2><div class="text-xs text-gray-900 whitespace-pre-line leading-relaxed">${profile.extracurriculars.join('\n\n')}</div></div>` : ''}
                ${profile.education ? `<div><h2 class="text-[10px] font-bold text-black text-center uppercase tracking-[0.3em] border-b border-gray-300 pb-1 mb-2 mt-4">Education</h2><p class="text-xs text-gray-900 whitespace-pre-line text-center">${profile.education}</p></div>` : ''}
                ${profile.bar_admissions && profile.bar_admissions.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black text-center uppercase tracking-[0.3em] border-b border-gray-300 pb-1 mb-2 mt-4">Bar Admissions</h2><ul class="text-xs text-gray-900 list-disc list-inside space-y-1">${profile.bar_admissions.map(b => `<li>${b}</li>`).join('')}</ul></div>` : ''}
                ${profile.publications && profile.publications.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black text-center uppercase tracking-[0.3em] border-b border-gray-300 pb-1 mb-2 mt-4">Publications</h2><ul class="text-xs text-gray-900 list-disc list-inside space-y-1">${profile.publications.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
                ${profile.certifications && profile.certifications.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black text-center uppercase tracking-[0.3em] border-b border-gray-300 pb-1 mb-2 mt-4">Certifications</h2><ul class="text-xs text-gray-900 list-disc list-inside space-y-1">${profile.certifications.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                ${profile.personal_details && profile.personal_details.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black text-center uppercase tracking-[0.3em] border-b border-gray-300 pb-1 mb-2 mt-4">Personal Details</h2><ul class="text-xs text-gray-900 space-y-1 text-center">${profile.personal_details.map(p => `<li><strong>${p.label}:</strong> ${p.value}</li>`).join('')}</ul></div>` : ''}
            </div>
        </div>
        `;
    },

    // 16. NEW: PURPLE PRO
    purple_pro: function(profile, expFormatted) {
        return `
        <div style="font-family: Arial, sans-serif;">
            <div class="bg-[#5E35B1] text-white p-5 mb-4 shadow-sm">
                <h1 class="text-3xl font-bold tracking-tight">${profile.name}</h1>
                <p class="text-[11px] text-white font-semibold mt-1.5 leading-relaxed">${profile.title}</p>
                <p class="text-[10px] text-purple-200 mt-1 opacity-90">${profile.contact.replace(/ \| /g, ' | ')}</p>
                ${profile.portfolio_links && profile.portfolio_links.length > 0 ? `<p class="text-[10px] text-purple-100 mt-0.5 opacity-90">${profile.portfolio_links.join(' | ')}</p>` : ''}
            </div>
            <div class="space-y-3 px-2">
                <div><h2 class="text-[11px] font-bold text-[#5E35B1] uppercase tracking-wide border-b-2 border-purple-100 pb-1 mb-1.5">Professional Summary</h2><p class="text-xs text-gray-800 leading-relaxed">${profile.summary}</p></div>
                ${profile.achievements && profile.achievements.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#5E35B1] uppercase tracking-wide border-b-2 border-purple-100 pb-1 mb-1.5 mt-3">Achievements</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
                ${profile.technical_skills && profile.technical_skills.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#5E35B1] uppercase tracking-wide border-b-2 border-purple-100 pb-1 mb-1.5 mt-3">Technical Profile</h2><div class="text-xs text-gray-800 space-y-1">${profile.technical_skills.map(t => `<div class="flex"><span class="font-bold w-1/4 uppercase">${t.category}:</span><span class="w-3/4">${t.skills.join(', ')}</span></div>`).join('')}</div></div>` : ''}
                ${profile.clinical_rotations && profile.clinical_rotations.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#5E35B1] uppercase tracking-wide border-b-2 border-purple-100 pb-1 mb-1.5 mt-3">Clinical Rotations</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.clinical_rotations.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                <div><h2 class="text-[11px] font-bold text-[#5E35B1] uppercase tracking-wide border-b-2 border-purple-100 pb-1 mb-1.5 mt-3">Work Experience</h2><div class="text-xs text-gray-800">${expFormatted}</div></div>
                ${profile.internships && profile.internships.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#5E35B1] uppercase tracking-wide border-b-2 border-purple-100 pb-1 mb-1.5 mt-3">Internships</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.internships.join('\\n\\n')}</div></div>` : ''}
                ${profile.projects && profile.projects.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#5E35B1] uppercase tracking-wide border-b-2 border-purple-100 pb-1 mb-1.5 mt-3">Projects</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.projects.join('\\n\\n')}</div></div>` : ''}
                ${profile.volunteer && profile.volunteer.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#5E35B1] uppercase tracking-wide border-b-2 border-purple-100 pb-1 mb-1.5 mt-3">Volunteer Work</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.volunteer.join('\\n\\n')}</div></div>` : ''}
                ${profile.extracurriculars && profile.extracurriculars.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#5E35B1] uppercase tracking-wide border-b-2 border-purple-100 pb-1 mb-1.5 mt-3">Extracurriculars</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.extracurriculars.join('\\n\\n')}</div></div>` : ''}
                ${profile.education ? `<div><h2 class="text-[11px] font-bold text-[#5E35B1] uppercase tracking-wide border-b-2 border-purple-100 pb-1 mb-1.5 mt-3">Education</h2><p class="text-xs text-gray-800 whitespace-pre-line">${profile.education}</p></div>` : ''}
                ${profile.bar_admissions && profile.bar_admissions.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#5E35B1] uppercase tracking-wide border-b-2 border-purple-100 pb-1 mb-1.5 mt-3">Bar Admissions</h2><ul class="text-xs text-gray-800 list-disc list-inside space-y-1">${profile.bar_admissions.map(b => `<li>${b}</li>`).join('')}</ul></div>` : ''}
                ${profile.publications && profile.publications.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#5E35B1] uppercase tracking-wide border-b-2 border-purple-100 pb-1 mb-1.5 mt-3">Publications</h2><ul class="text-xs text-gray-800 list-disc list-inside space-y-1">${profile.publications.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
                ${profile.skills && profile.skills.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#5E35B1] uppercase tracking-wide border-b-2 border-purple-100 pb-1 mb-1.5 mt-3">Skills</h2><p class="text-xs text-gray-800 leading-relaxed">${profile.skills.join(' • ')}</p></div>` : ''}
                ${profile.certifications && profile.certifications.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#5E35B1] uppercase tracking-wide border-b-2 border-purple-100 pb-1 mb-1.5 mt-3">Certifications</h2><ul class="text-xs text-gray-800 list-disc list-inside space-y-1">${profile.certifications.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                ${profile.personal_details && profile.personal_details.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#5E35B1] uppercase tracking-wide border-b-2 border-purple-100 pb-1 mb-1.5 mt-3">Personal Details</h2><ul class="text-xs text-gray-800 space-y-1">${profile.personal_details.map(p => `<li><strong>${p.label}:</strong> ${p.value}</li>`).join('')}</ul></div>` : ''}
            </div>
        </div>
        `;
    },
    
    // 17. NEW: RECTOR
    rector: function(profile, expFormatted) {
        return `
        <div style="font-family: Georgia, serif;">
            <div class="mb-5 font-serif">
                <h1 class="text-4xl font-black text-black tracking-tighter uppercase leading-none">${profile.name.split(' ')[0]}</h1>
                <h1 class="text-4xl font-black text-black tracking-tighter uppercase leading-none">${profile.name.split(' ').slice(1).join(' ')}</h1>
                <div class="border-t border-gray-300 mt-3 pt-2">
                    <p class="text-xs font-bold text-gray-800 leading-relaxed">${profile.title}</p>
                    <p class="text-[10px] text-gray-600 mt-1">${profile.contact.replace(/ \| /g, ' • ')}</p>
                    ${profile.portfolio_links && profile.portfolio_links.length > 0 ? `<p class="text-[10px] text-blue-700 mt-0.5">${profile.portfolio_links.join(' • ')}</p>` : ''}
                </div>
            </div>
            <div class="space-y-4 font-serif">
                <div><h2 class="text-[11px] font-bold text-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-2">Executive Profile</h2><p class="text-xs text-gray-900 leading-relaxed text-justify">${profile.summary}</p></div>
                ${profile.achievements && profile.achievements.length > 0 ? `<div><h2 class="text-[11px] font-bold text-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-2 mt-4">Achievements</h2><ul class="list-disc pl-4 text-xs text-gray-900 space-y-1">${profile.achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
                ${profile.technical_skills && profile.technical_skills.length > 0 ? `<div><h2 class="text-[11px] font-bold text-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-2 mt-4">Technical Profile</h2><div class="text-xs text-gray-900 space-y-1">${profile.technical_skills.map(t => `<div class="flex"><span class="font-bold w-1/4 uppercase">${t.category}:</span><span class="w-3/4">${t.skills.join(', ')}</span></div>`).join('')}</div></div>` : ''}
                ${profile.clinical_rotations && profile.clinical_rotations.length > 0 ? `<div><h2 class="text-[11px] font-bold text-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-2 mt-4">Clinical Rotations</h2><ul class="list-disc pl-4 text-xs text-gray-900 space-y-1">${profile.clinical_rotations.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                <div><h2 class="text-[11px] font-bold text-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-2 mt-4">Career History</h2><div class="text-xs text-gray-900">${expFormatted}</div></div>
                ${profile.internships && profile.internships.length > 0 ? `<div><h2 class="text-[11px] font-bold text-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-2 mt-4">Internships</h2><div class="text-xs text-gray-900 whitespace-pre-line leading-relaxed">${profile.internships.join('\n\n')}</div></div>` : ''}
                ${profile.projects && profile.projects.length > 0 ? `<div><h2 class="text-[11px] font-bold text-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-2 mt-4">Projects</h2><div class="text-xs text-gray-900 whitespace-pre-line leading-relaxed">${profile.projects.join('\n\n')}</div></div>` : ''}
                ${profile.volunteer && profile.volunteer.length > 0 ? `<div><h2 class="text-[11px] font-bold text-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-2 mt-4">Volunteer Work</h2><div class="text-xs text-gray-900 whitespace-pre-line leading-relaxed">${profile.volunteer.join('\n\n')}</div></div>` : ''}
                ${profile.extracurriculars && profile.extracurriculars.length > 0 ? `<div><h2 class="text-[11px] font-bold text-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-2 mt-4">Extracurriculars</h2><div class="text-xs text-gray-900 whitespace-pre-line leading-relaxed">${profile.extracurriculars.join('\n\n')}</div></div>` : ''}
                ${profile.education ? `<div><h2 class="text-[11px] font-bold text-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-2 mt-4">Education</h2><p class="text-xs text-gray-900 whitespace-pre-line">${profile.education}</p></div>` : ''}
                ${profile.bar_admissions && profile.bar_admissions.length > 0 ? `<div><h2 class="text-[11px] font-bold text-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-2 mt-4">Bar Admissions</h2><ul class="text-xs text-gray-900 list-disc list-inside space-y-1">${profile.bar_admissions.map(b => `<li>${b}</li>`).join('')}</ul></div>` : ''}
                ${profile.publications && profile.publications.length > 0 ? `<div><h2 class="text-[11px] font-bold text-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-2 mt-4">Publications</h2><ul class="text-xs text-gray-900 list-disc list-inside space-y-1">${profile.publications.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
                ${profile.certifications && profile.certifications.length > 0 ? `<div><h2 class="text-[11px] font-bold text-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-2 mt-4">Certifications</h2><ul class="text-xs text-gray-900 list-disc list-inside space-y-1">${profile.certifications.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                ${profile.personal_details && profile.personal_details.length > 0 ? `<div><h2 class="text-[11px] font-bold text-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 mb-2 mt-4">Personal Details</h2><ul class="text-xs text-gray-900 space-y-1">${profile.personal_details.map(p => `<li><strong>${p.label}:</strong> ${p.value}</li>`).join('')}</ul></div>` : ''}
            </div>
        </div>
        `;
    },

    // 18. NEW: ROSE MODERN
    rose_modern: function(profile, expFormatted) {
        return `
        <div style="font-family: Arial, sans-serif;">
            <div class="bg-[#90323D] text-white p-5 mb-4">
                <h1 class="text-3xl font-bold tracking-wide">${profile.name}</h1>
                <p class="text-xs font-semibold text-pink-50 mt-1.5 leading-relaxed">${profile.title}</p>
                <p class="text-[10px] text-pink-200 mt-1">${profile.contact.replace(/ \| /g, ' | ')}</p>
                ${profile.portfolio_links && profile.portfolio_links.length > 0 ? `<p class="text-[10px] text-pink-100 mt-0.5">${profile.portfolio_links.join(' | ')}</p>` : ''}
            </div>
            <div class="grid grid-cols-12 gap-6 px-2">
                <div class="col-span-4 space-y-4 bg-pink-50/50 p-3 rounded">
                    ${profile.education ? `<div><h3 class="text-[10px] font-bold text-[#90323D] uppercase tracking-wider border-b border-pink-200 pb-1 mb-1.5">Education</h3><p class="text-[10px] text-gray-800 whitespace-pre-line">${profile.education}</p></div>` : ''}
                    ${profile.bar_admissions && profile.bar_admissions.length > 0 ? `<div><h3 class="text-[10px] font-bold text-[#90323D] uppercase tracking-wider border-b border-pink-200 pb-1 mb-1.5 mt-3">Bar Admissions</h3><ul class="text-[10px] text-gray-800 space-y-1">${profile.bar_admissions.map(b => `<li>${b}</li>`).join('')}</ul></div>` : ''}
                    ${profile.publications && profile.publications.length > 0 ? `<div><h3 class="text-[10px] font-bold text-[#90323D] uppercase tracking-wider border-b border-pink-200 pb-1 mb-1.5 mt-3">Publications</h3><ul class="text-[10px] text-gray-800 space-y-1">${profile.publications.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
                    ${profile.skills && profile.skills.length > 0 ? `<div><h3 class="text-[10px] font-bold text-[#90323D] uppercase tracking-wider border-b border-pink-200 pb-1 mb-1.5 mt-3">Core Skills</h3><ul class="text-[10px] text-gray-800 space-y-1">${profile.skills.slice(0,10).map(s => `<li>${s}</li>`).join('')}</ul></div>` : ''}
                    ${profile.certifications && profile.certifications.length > 0 ? `<div><h3 class="text-[10px] font-bold text-[#90323D] uppercase tracking-wider border-b border-pink-200 pb-1 mb-1.5 mt-3">Certifications</h3><ul class="text-[10px] text-gray-800 space-y-1">${profile.certifications.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                    ${profile.personal_details && profile.personal_details.length > 0 ? `<div><h3 class="text-[10px] font-bold text-[#90323D] uppercase tracking-wider border-b border-pink-200 pb-1 mb-1.5 mt-3">Personal Details</h3><ul class="text-[10px] text-gray-800 space-y-1">${profile.personal_details.map(p => `<li><strong>${p.label}:</strong> ${p.value}</li>`).join('')}</ul></div>` : ''}
                </div>
                <div class="col-span-8 space-y-4">
                    <div><h3 class="text-[11px] font-bold text-[#90323D] uppercase tracking-wider border-b-2 border-pink-100 pb-1 mb-2">Professional Summary</h3><p class="text-xs text-gray-800 leading-relaxed">${profile.summary}</p></div>
                    ${profile.achievements && profile.achievements.length > 0 ? `<div><h3 class="text-[11px] font-bold text-[#90323D] uppercase tracking-wider border-b-2 border-pink-100 pb-1 mb-2 mt-4">Achievements</h3><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
                    ${profile.technical_skills && profile.technical_skills.length > 0 ? `<div><h3 class="text-[11px] font-bold text-[#90323D] uppercase tracking-wider border-b-2 border-pink-100 pb-1 mb-2 mt-4">Technical Profile</h3><div class="text-xs text-gray-800 space-y-1">${profile.technical_skills.map(t => `<div class="flex"><span class="font-bold w-1/4 uppercase">${t.category}:</span><span class="w-3/4">${t.skills.join(', ')}</span></div>`).join('')}</div></div>` : ''}
                    ${profile.clinical_rotations && profile.clinical_rotations.length > 0 ? `<div><h3 class="text-[11px] font-bold text-[#90323D] uppercase tracking-wider border-b-2 border-pink-100 pb-1 mb-2 mt-4">Clinical Rotations</h3><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.clinical_rotations.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                    <div><h3 class="text-[11px] font-bold text-[#90323D] uppercase tracking-wider border-b-2 border-pink-100 pb-1 mb-2 mt-4">Work Experience</h3><div class="text-xs text-gray-800">${expFormatted}</div></div>
                    ${profile.internships && profile.internships.length > 0 ? `<div><h3 class="text-[11px] font-bold text-[#90323D] uppercase tracking-wider border-b-2 border-pink-100 pb-1 mb-2 mt-4">Internships</h3><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.internships.join('\n\n')}</div></div>` : ''}
                    ${profile.projects && profile.projects.length > 0 ? `<div><h3 class="text-[11px] font-bold text-[#90323D] uppercase tracking-wider border-b-2 border-pink-100 pb-1 mb-2 mt-4">Projects</h3><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.projects.join('\n\n')}</div></div>` : ''}
                    ${profile.volunteer && profile.volunteer.length > 0 ? `<div><h3 class="text-[11px] font-bold text-[#90323D] uppercase tracking-wider border-b-2 border-pink-100 pb-1 mb-2 mt-4">Volunteer Work</h3><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.volunteer.join('\n\n')}</div></div>` : ''}
                    ${profile.extracurriculars && profile.extracurriculars.length > 0 ? `<div><h3 class="text-[11px] font-bold text-[#90323D] uppercase tracking-wider border-b-2 border-pink-100 pb-1 mb-2 mt-4">Extracurriculars</h3><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.extracurriculars.join('\n\n')}</div></div>` : ''}
                </div>
            </div>
        </div>
        `;
    },

    // 19. NEW: SIGNAL
    signal: function(profile, expFormatted) {
        return `
        <div style="font-family: Arial, sans-serif;">
            <div class="mb-5">
                <h1 class="text-3xl font-black text-black uppercase tracking-tight">${profile.name}</h1>
                <p class="text-xs font-bold text-gray-800 mt-1.5 leading-relaxed">${profile.title}</p>
                <p class="text-[10px] text-gray-500 mt-0.5">${profile.contact.replace(/ \| /g, ' · ')}</p>
                ${profile.portfolio_links && profile.portfolio_links.length > 0 ? `<p class="text-[10px] text-blue-600 mt-0.5">${profile.portfolio_links.join(' · ')}</p>` : ''}
            </div>
            <div class="space-y-4">
                <div class="border-l-4 border-black pl-3"><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.25em] mb-1.5">Profile</h2><p class="text-xs text-gray-800 leading-relaxed">${profile.summary}</p></div>
                ${profile.achievements && profile.achievements.length > 0 ? `<div class="border-l-4 border-black pl-3 mt-4"><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.25em] mb-1.5">Achievements</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
                ${profile.technical_skills && profile.technical_skills.length > 0 ? `<div class="border-l-4 border-black pl-3 mt-4"><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.25em] mb-1.5">Technical Profile</h2><div class="text-xs text-gray-800 space-y-1">${profile.technical_skills.map(t => `<div class="flex"><span class="font-bold w-1/4 uppercase">${t.category}:</span><span class="w-3/4">${t.skills.join(', ')}</span></div>`).join('')}</div></div>` : ''}
                ${profile.clinical_rotations && profile.clinical_rotations.length > 0 ? `<div class="border-l-4 border-black pl-3 mt-4"><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.25em] mb-1.5">Clinical Rotations</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.clinical_rotations.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                <div class="border-l-4 border-black pl-3 mt-4"><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.25em] mb-1.5">Experience</h2><div class="text-xs text-gray-800">${expFormatted}</div></div>
                ${profile.internships && profile.internships.length > 0 ? `<div class="border-l-4 border-black pl-3 mt-4"><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.25em] mb-1.5">Internships</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.internships.join('\n\n')}</div></div>` : ''}
                ${profile.projects && profile.projects.length > 0 ? `<div class="border-l-4 border-black pl-3 mt-4"><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.25em] mb-1.5">Projects</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.projects.join('\n\n')}</div></div>` : ''}
                ${profile.volunteer && profile.volunteer.length > 0 ? `<div class="border-l-4 border-black pl-3 mt-4"><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.25em] mb-1.5">Volunteer Work</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.volunteer.join('\n\n')}</div></div>` : ''}
                ${profile.extracurriculars && profile.extracurriculars.length > 0 ? `<div class="border-l-4 border-black pl-3 mt-4"><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.25em] mb-1.5">Extracurriculars</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.extracurriculars.join('\n\n')}</div></div>` : ''}
                ${profile.education ? `<div class="border-l-4 border-black pl-3 mt-4"><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.25em] mb-1.5">Education</h2><p class="text-xs text-gray-800 whitespace-pre-line">${profile.education}</p></div>` : ''}
                ${profile.bar_admissions && profile.bar_admissions.length > 0 ? `<div class="border-l-4 border-black pl-3 mt-4"><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.25em] mb-1.5">Bar Admissions</h2><ul class="text-xs text-gray-800 list-disc list-inside space-y-1">${profile.bar_admissions.map(b => `<li>${b}</li>`).join('')}</ul></div>` : ''}
                ${profile.publications && profile.publications.length > 0 ? `<div class="border-l-4 border-black pl-3 mt-4"><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.25em] mb-1.5">Publications</h2><ul class="text-xs text-gray-800 list-disc list-inside space-y-1">${profile.publications.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
                ${profile.skills && profile.skills.length > 0 ? `<div class="border-l-4 border-black pl-3 mt-4"><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.25em] mb-1.5">Technical Stack</h2><p class="text-xs text-gray-800 leading-relaxed">${profile.skills.join(' · ')}</p></div>` : ''}
                ${profile.certifications && profile.certifications.length > 0 ? `<div class="border-l-4 border-black pl-3 mt-4"><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.25em] mb-1.5">Certifications</h2><ul class="text-xs text-gray-800 list-disc list-inside space-y-1">${profile.certifications.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                ${profile.personal_details && profile.personal_details.length > 0 ? `<div class="border-l-4 border-black pl-3 mt-4"><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.25em] mb-1.5">Personal Details</h2><ul class="text-xs text-gray-800 space-y-1">${profile.personal_details.map(p => `<li><strong>${p.label}:</strong> ${p.value}</li>`).join('')}</ul></div>` : ''}
            </div>
        </div>
        `;
    },

    // 20. NEW: SLATE PROFESSIONAL
    slate_professional: function(profile, expFormatted) {
        return `
        <div style="font-family: Arial, sans-serif;">
            <div class="bg-[#334155] text-white p-5 mb-4">
                <h1 class="text-3xl font-bold tracking-wide">${profile.name}</h1>
                <p class="text-[11px] font-bold text-slate-200 mt-1.5 uppercase tracking-wider leading-relaxed">${profile.title}</p>
                <p class="text-[9px] text-slate-400 mt-1">${profile.contact.replace(/ \| /g, ' | ')}</p>
                ${profile.portfolio_links && profile.portfolio_links.length > 0 ? `<p class="text-[9px] text-blue-300 mt-0.5">${profile.portfolio_links.join(' | ')}</p>` : ''}
            </div>
            <div class="space-y-3 px-2">
                <div><h2 class="text-[11px] font-bold text-[#334155] border-b-2 border-slate-200 pb-1 mb-1.5 uppercase">Executive Summary</h2><p class="text-xs text-gray-800 leading-relaxed">${profile.summary}</p></div>
                ${profile.achievements && profile.achievements.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#334155] border-b-2 border-slate-200 pb-1 mb-1.5 uppercase mt-3">Achievements</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
                ${profile.technical_skills && profile.technical_skills.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#334155] border-b-2 border-slate-200 pb-1 mb-1.5 uppercase mt-3">Technical Profile</h2><div class="text-xs text-gray-800 space-y-1">${profile.technical_skills.map(t => `<div class="flex"><span class="font-bold w-1/4 uppercase">${t.category}:</span><span class="w-3/4">${t.skills.join(', ')}</span></div>`).join('')}</div></div>` : ''}
                ${profile.clinical_rotations && profile.clinical_rotations.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#334155] border-b-2 border-slate-200 pb-1 mb-1.5 uppercase mt-3">Clinical Rotations</h2><ul class="list-disc pl-4 text-xs text-gray-800 space-y-1">${profile.clinical_rotations.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                <div><h2 class="text-[11px] font-bold text-[#334155] border-b-2 border-slate-200 pb-1 mb-1.5 uppercase mt-3">Professional Experience</h2><div class="text-xs text-gray-800">${expFormatted}</div></div>
                ${profile.internships && profile.internships.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#334155] border-b-2 border-slate-200 pb-1 mb-1.5 uppercase mt-3">Internships</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.internships.join('\n\n')}</div></div>` : ''}
                ${profile.projects && profile.projects.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#334155] border-b-2 border-slate-200 pb-1 mb-1.5 uppercase mt-3">Projects</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.projects.join('\n\n')}</div></div>` : ''}
                ${profile.volunteer && profile.volunteer.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#334155] border-b-2 border-slate-200 pb-1 mb-1.5 uppercase mt-3">Volunteer Work</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.volunteer.join('\n\n')}</div></div>` : ''}
                ${profile.extracurriculars && profile.extracurriculars.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#334155] border-b-2 border-slate-200 pb-1 mb-1.5 uppercase mt-3">Extracurriculars</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.extracurriculars.join('\n\n')}</div></div>` : ''}
                ${profile.education ? `<div><h2 class="text-[11px] font-bold text-[#334155] border-b-2 border-slate-200 pb-1 mb-1.5 uppercase mt-3">Education</h2><p class="text-xs text-gray-800 whitespace-pre-line">${profile.education}</p></div>` : ''}
                ${profile.bar_admissions && profile.bar_admissions.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#334155] border-b-2 border-slate-200 pb-1 mb-1.5 uppercase mt-3">Bar Admissions</h2><ul class="text-xs text-gray-800 list-disc list-inside space-y-1">${profile.bar_admissions.map(b => `<li>${b}</li>`).join('')}</ul></div>` : ''}
                ${profile.publications && profile.publications.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#334155] border-b-2 border-slate-200 pb-1 mb-1.5 uppercase mt-3">Publications</h2><ul class="text-xs text-gray-800 list-disc list-inside space-y-1">${profile.publications.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
                ${profile.skills && profile.skills.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#334155] border-b-2 border-slate-200 pb-1 mb-1.5 uppercase mt-3">Skills & Expertise</h2><p class="text-xs text-gray-800 leading-relaxed">${profile.skills.join(', ')}</p></div>` : ''}
                ${profile.certifications && profile.certifications.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#334155] border-b-2 border-slate-200 pb-1 mb-1.5 uppercase mt-3">Certifications</h2><ul class="text-xs text-gray-800 list-disc list-inside space-y-1">${profile.certifications.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                ${profile.personal_details && profile.personal_details.length > 0 ? `<div><h2 class="text-[11px] font-bold text-[#334155] border-b-2 border-slate-200 pb-1 mb-1.5 uppercase mt-3">Personal Details</h2><ul class="text-xs text-gray-800 space-y-1">${profile.personal_details.map(p => `<li><strong>${p.label}:</strong> ${p.value}</li>`).join('')}</ul></div>` : ''}
            </div>
        </div>
        `;
    },

    // 21. NEW: ZENITH
    zenith: function(profile, expFormatted) {
        return `
        <div style="font-family: Georgia, serif;">
            <div class="bg-[#111111] text-white p-6 mb-4 font-serif">
                <h1 class="text-4xl font-bold tracking-widest uppercase">${profile.name}</h1>
                <p class="text-xs font-bold text-gray-200 mt-1.5 border-t border-gray-600 pt-2 leading-relaxed">${profile.title}</p>
            </div>
            <div class="text-right text-[9px] text-gray-500 mb-4 px-2">
                ${profile.contact.replace(/ \| /g, '  |  ')}
                ${profile.portfolio_links && profile.portfolio_links.length > 0 ? `<br><span class="text-blue-600">${profile.portfolio_links.join('  |  ')}</span>` : ''}
            </div>
            <div class="space-y-4 px-2 font-serif">
                <div><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-1.5">· Profile</h2><p class="text-xs text-gray-800 leading-relaxed">${profile.summary}</p></div>
                ${profile.achievements && profile.achievements.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-1.5 mt-4">· Achievements</h2><ul class="list-disc pl-5 text-xs text-gray-800 space-y-1">${profile.achievements.map(a => `<li>${a}</li>`).join('')}</ul></div>` : ''}
                ${profile.technical_skills && profile.technical_skills.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-1.5 mt-4">· Technical Profile</h2><div class="text-xs text-gray-800 space-y-1">${profile.technical_skills.map(t => `<div class="flex"><span class="font-bold w-1/4 uppercase">${t.category}:</span><span class="w-3/4">${t.skills.join(', ')}</span></div>`).join('')}</div></div>` : ''}
                ${profile.clinical_rotations && profile.clinical_rotations.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-1.5 mt-4">· Clinical Rotations</h2><ul class="list-disc pl-5 text-xs text-gray-800 space-y-1">${profile.clinical_rotations.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                <div><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-1.5 mt-4">· Career History</h2><div class="text-xs text-gray-800">${expFormatted}</div></div>
                ${profile.internships && profile.internships.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-1.5 mt-4">· Internships</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.internships.join('\\n\\n')}</div></div>` : ''}
                ${profile.projects && profile.projects.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-1.5 mt-4">· Projects</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.projects.join('\\n\\n')}</div></div>` : ''}
                ${profile.volunteer && profile.volunteer.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-1.5 mt-4">· Volunteer Work</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.volunteer.join('\\n\\n')}</div></div>` : ''}
                ${profile.extracurriculars && profile.extracurriculars.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-1.5 mt-4">· Extracurriculars</h2><div class="text-xs text-gray-800 whitespace-pre-line leading-relaxed">${profile.extracurriculars.join('\\n\\n')}</div></div>` : ''}
                ${profile.education ? `<div><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-1.5 mt-4">· Education</h2><p class="text-xs text-gray-800 whitespace-pre-line">${profile.education}</p></div>` : ''}
                ${profile.bar_admissions && profile.bar_admissions.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-1.5 mt-4">· Bar Admissions</h2><ul class="text-xs text-gray-800 list-disc pl-5 space-y-1">${profile.bar_admissions.map(b => `<li>${b}</li>`).join('')}</ul></div>` : ''}
                ${profile.publications && profile.publications.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-1.5 mt-4">· Publications</h2><ul class="text-xs text-gray-800 list-disc pl-5 space-y-1">${profile.publications.map(p => `<li>${p}</li>`).join('')}</ul></div>` : ''}
                ${profile.certifications && profile.certifications.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-1.5 mt-4">· Credentials & Certifications</h2><ul class="text-xs text-gray-800 list-disc pl-5 space-y-1">${profile.certifications.map(c => `<li>${c}</li>`).join('')}</ul></div>` : ''}
                ${profile.personal_details && profile.personal_details.length > 0 ? `<div><h2 class="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-1.5 mt-4">· Personal Details</h2><ul class="text-xs text-gray-800 space-y-1">${profile.personal_details.map(p => `<li><strong>${p.label}:</strong> ${p.value}</li>`).join('')}</ul></div>` : ''}
            </div>
        </div>
        `;
    },    
        
    // --- The Render Router ---
    renderLayout: function(layoutName, profile, expFormatted) {
        
        // 1. DATA SANITIZER & MASTER SYNC
        if (profile) {
            
            // FIX: Ensure photo persists cleanly to the HTML renderer
            profile.photo = profile.photo || null;

            // MASTER SYNC: Achievements/Awards
            const unifiedAchievements = profile.achievements || profile.achievements_and_awards || [];
            profile.achievements = Array.isArray(unifiedAchievements) ? unifiedAchievements : [unifiedAchievements];
            profile.achievements_and_awards = profile.achievements;

            // Industry Specific Fields Sanitization
            if (typeof profile.clinical_rotations === 'string') profile.clinical_rotations = [profile.clinical_rotations];
            if (typeof profile.publications === 'string') profile.publications = [profile.publications];
            if (typeof profile.portfolio_links === 'string') profile.portfolio_links = [profile.portfolio_links];
            if (typeof profile.bar_admissions === 'string') profile.bar_admissions = [profile.bar_admissions];
            
            // Ensure industry arrays default to empty arrays
            profile.clinical_rotations = profile.clinical_rotations || [];
            profile.publications = profile.publications || [];
            profile.portfolio_links = profile.portfolio_links || [];
            profile.bar_admissions = profile.bar_admissions || [];
            
            // Technical skills must be an array of objects. Fallback to empty array if malformed.
            profile.technical_skills = Array.isArray(profile.technical_skills) ? profile.technical_skills : [];

            // Existing field arrays
            if (typeof profile.skills === 'string') profile.skills = profile.skills.split(',').map(s => s.trim());
            if (typeof profile.certifications === 'string') profile.certifications = [profile.certifications];
            if (typeof profile.personal_details === 'string') profile.personal_details = []; 
            if (typeof profile.internships === 'string') profile.internships = [profile.internships];
            if (typeof profile.projects === 'string') profile.projects = [profile.projects];
            if (typeof profile.volunteer === 'string') profile.volunteer = [profile.volunteer];
            if (typeof profile.extracurriculars === 'string') profile.extracurriculars = [profile.extracurriculars];

            profile.skills = profile.skills || [];
            profile.certifications = profile.certifications || [];
            profile.personal_details = Array.isArray(profile.personal_details) ? profile.personal_details : [];
            profile.internships = profile.internships || [];
            profile.projects = profile.projects || [];
            profile.volunteer = profile.volunteer || [];
            profile.extracurriculars = profile.extracurriculars || [];

            // Existing strings
            profile.name = profile.name || 'Professional';
            profile.title = profile.title || '';
            profile.contact = profile.contact || '';
            profile.summary = profile.summary || '';
            profile.education = profile.education || '';
        }

        // 2. RENDER ROUTER
        if (this[layoutName]) {
            return this[layoutName](profile, expFormatted);
        } else {
            return this['sentinel'](profile, expFormatted);
        }
    }
};
