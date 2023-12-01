#!/usr/bin/perl
# A simple script that checks the files listed in index.json and then 
# 1. Checks if a parameter is given in index.json but doesn't exist in config.json
# 2. Checks if the file exists
# 3. If the filename contains spaces, ampersands, or brackets it moves them and updates the index.json file

use Data::Dumper;
use JSON::XS;
use POSIX qw(strftime);

$logfile = "warnings.log";
$fix = $ARGV[0]||0;


# Load the config files
$index = loadJSON("index.json");
$config = loadJSON("config.json");


$warnings = "";
$updates = "";

# Loop over scenarios
foreach $scenario (sort(keys(%{$index}))){

	foreach $d (sort(keys(%{$index->{$scenario}{'data'}}))){

		if(!$config->{$d}){

			$warnings .= "WARNING: No parameter $d has been defined in config.json but is defined for $scenario\n";

		}

		if(!-e $index->{$scenario}{'data'}{$d}{'file'}){

			$warnings .= "WARNING: File \"$index->{$scenario}{'data'}{$d}{'file'}\" referenced in index.json doesn't appear to exist.\n";

		}else{
			
			# Make sure it is valid here
			$file = $index->{$scenario}{'data'}{$d}{'file'};
			$newf = $index->{$scenario}{'data'}{$d}{'file'};
			
			if($file =~ / /){
				#$warnings .= "WARNING: $filenames[$i] contains a space.\n";
				$newf =~ s/ /\_/g;
				$newf =~ s/\_\.csv/.csv/g;
			}
			if($file =~ /\&/){
				#$warnings .= "WARNING: $filenames[$i] contains an ampersand.\n";
				$newf =~ s/\&/\_and\_/g;
				$newf =~ s/\_\.csv/.csv/g;
			}
			if($file =~ /\&/){
				#$warnings .= "WARNING: $filenames[$i] contains a bracket.\n";
				$newf =~ s/[\(\)]/\_/g;
				$newf =~ s/\_\.csv/.csv/g;
			}
			
			if($newf ne $file){

				# We need to update the file name
				#print "Need to fix file $file -> $newf\n";
				$updates .= "git mv \"$file\" \"$newf\"\n";
			
				if($fix){
					# 1. Update Git repo
					`git mv \"$file\" \"$newf\"`;

					# 2. Update index.json
					# We can't just change the JSON and save it as that 
					# will change the ordering. So we just update the file.
					$f1 = $file;
					$f2 = $newf;
					$f1 =~ s/\//\\\//g;
					$f2 =~ s/\//\\\//g;
					`sed -i 's/$f1/$f2/' index.json`;
					$updates .= "sed -i 's/$f1/$f2/' index.json\n";
				}
			}
		}
	}
}

if(-e $logfile){
	`rm $logfile`;
}
open(FILE,">>",$logfile);
print FILE "---\n";
print FILE "Date: ".strftime("%FT%H:%M:%S", gmtime)."\n";
print FILE "---\n\n";
print FILE "Results of validate.pl\n\n";
print FILE "## Warnings:\n\n";
print FILE $warnings;
print FILE "\n\n";
print FILE "## Updates\n\n";
print FILE $updates;
close(FILE);

if(!$fix){
	print "\nNo fixes applied. Run with 'perl validate.pl 1' to apply fixes.\n";
}

##############
# SUBROUTINES

sub loadJSON {
	my ($file) = $_[0];
	my (@lines,$json,$coder);
	open(FILE,$file);
	@lines = <FILE>;
	close(FILE);

	$str = join("",@lines);
	$coder = JSON::XS->new->utf8->allow_nonref;
	$json = $coder->decode($str || "{}");
	return $json;
}
